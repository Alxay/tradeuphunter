<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Skin;
use App\Models\Price;

#[Signature('app:update-skins-prices')]
#[Description('Update skins prices from an external API using memory-efficient streaming')]
class UpdateSkinsPrices extends Command
{
    public function handle()
    {   
        // Set higher execution time, but keep low memory limit to prove efficiency
        ini_set('memory_limit', '128M');
        ini_set('max_execution_time', '300');

        $this->info('Connecting to external API to fetch skins prices...');
        
        $tempPath = storage_path('app/prices.json');
        
        // Ensure parent directory exists
        if (!is_dir(dirname($tempPath))) {
            mkdir(dirname($tempPath), 0755, true);
        }

        $this->info("Streaming API response directly to disk: {$tempPath}");
        
        $response = Http::timeout(180)->sink($tempPath)->get('https://api.steamapis.com/market/items/730?api_key=' . env('PRICE_API_KEY'));

        if ($response->failed() || !file_exists($tempPath) || filesize($tempPath) === 0) {
            $this->error('Error fetching skins prices: ' . ($response->status() ?? 'No response file'));
            return;
        }

        $this->info('Data downloaded successfully. Preloading skins from database...');

        // Preload all database skins to avoid N+1 queries inside the loop
        DB::connection()->disableQueryLog();
        $skinsMap = [];
        Skin::with('weapon')->chunk(200, function ($skins) use (&$skinsMap) {
            foreach ($skins as $skin) {
                if ($skin->weapon) {
                    $key = trim($skin->weapon->name) . ' | ' . trim($skin->name);
                    $skinsMap[$key] = $skin->id;
                }
            }
        });

        $this->info(count($skinsMap) . ' skins pre-cached in memory. Beginning database sync...');

        $count = 0;
        $updatedCount = 0;

        foreach ($this->streamJsonItems($tempPath) as $skinData) {
            $count++;
            
            $marketName = $skinData['market_name'] ?? null;

            if (!$marketName) {
                continue;
            }

            // 1. FILTERS
            // Exclude everything that is not a skin weapon (no " | ")
            if (!str_contains($marketName, ' | ')) {
                continue;
            }

            // Reject items that are not weapon skins
            $exclude = ['Sticker', 'Music Kit', 'Graffiti', 'Patch', 'Agent', 'Gloves', '★', 'Souvenir', 'Collectible'];
            $shouldSkip = false;
            foreach ($exclude as $badWord) {
                if (str_contains($marketName, $badWord)) {
                    $shouldSkip = true;
                    break;
                }
            }

            if ($shouldSkip || !str_contains($marketName, '(')) {
                continue;
            }

            // 2. PARSING
            $isStatTrak = str_contains($marketName, 'StatTrak™');
            $tempName = str_replace('StatTrak™ ', '', $marketName);

            preg_match('/\((.*?)\)/', $tempName, $matches);
            $condition = $matches[1] ?? null;

            $cleanName = trim(str_replace("($condition)", "", $tempName));

            // 3. SEARCH IN DATABASE INDEX
            $skinId = $skinsMap[$cleanName] ?? null;

            if (!$skinId) {
                continue;
            }

            // 4. WRITE PRICE
            Price::updateOrCreate(
                [
                    'skin_id' => $skinId,
                    'condition' => $condition,
                    'is_stattrak' => $isStatTrak, 
                ],
                [
                    'price_24h' => $skinData['prices']['safe_ts']['last_24h'] ?? 0,
                    'price_7d' => $skinData['prices']['safe_ts']['last_7d'] ?? 0,
                    'price_30d' => $skinData['prices']['safe_ts']['last_30d'] ?? 0,
                    'price_90d' => $skinData['prices']['safe_ts']['last_90d'] ?? 0,
                    'liquidity' => $skinData['prices']['sold']['avg_daily_volume'] ?? 0,
                    'is_unstable' => $skinData['prices']['unstable'] ?? false,
                    'provider' => 'steam'
                ]
            );

            $updatedCount++;

            // Every 500 records, trigger garbage collection to free RAM
            if ($updatedCount % 500 === 0) {
                gc_collect_cycles();
                $this->info("Synced {$updatedCount} price records (Read {$count} JSON nodes)...");
            }
        }

        // Clean up temporary file
        if (file_exists($tempPath)) {
            unlink($tempPath);
        }

        $this->info("Completed. Synced {$updatedCount} price records successfully!");
    }

    /**
     * Memory-efficient incremental JSON streaming parser.
     * Yields objects from the "data" array as they are parsed from the file stream.
     */
    private function streamJsonItems($filePath)
    {
        $handle = fopen($filePath, 'r');
        if (!$handle) {
            return;
        }

        $buffer = '';
        $nesting = 0;
        $inString = false;
        $isEscaped = false;

        while (!feof($handle)) {
            $chunk = fread($handle, 65536); // Read 64KB chunks
            $len = strlen($chunk);
            
            for ($i = 0; $i < $len; $i++) {
                $char = $chunk[$i];

                if ($isEscaped) {
                    $isEscaped = false;
                    if ($nesting >= 2) {
                        $buffer .= $char;
                    }
                    continue;
                }

                if ($char === '\\') {
                    $isEscaped = true;
                    if ($nesting >= 2) {
                        $buffer .= $char;
                    }
                    continue;
                }

                if ($char === '"') {
                    $inString = !$inString;
                    if ($nesting >= 2) {
                        $buffer .= $char;
                    }
                    continue;
                }

                if (!$inString) {
                    if ($char === '{') {
                        $nesting++;
                        if ($nesting === 2) {
                            $buffer = '{';
                            continue;
                        }
                    } elseif ($char === '}') {
                        $nesting--;
                        if ($nesting === 1) {
                            $buffer .= '}';
                            $item = json_decode($buffer, true);
                            if (is_array($item)) {
                                yield $item;
                            }
                            $buffer = '';
                            continue;
                        }
                    }
                }

                if ($nesting >= 2) {
                    $buffer .= $char;
                }
            }
        }
        fclose($handle);
    }
}