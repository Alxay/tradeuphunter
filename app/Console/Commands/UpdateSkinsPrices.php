<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Skin;
use App\Models\Price;

#[Signature('app:update-skins-prices')]
#[Description('Update skins prices from an external API')]
class UpdateSkinsPrices extends Command
{
    public function handle()
    {   
        ini_set('memory_limit', '512M');
        $this->info('Connecting to external API to fetch skins prices...');
        
        
        $response = Http::timeout(60)->get('https://api.steamapis.com/market/items/730?api_key=' . env('PRICE_API_KEY'));

        if ($response->failed()) {
            $this->error('Error fetching skins prices: ' . $response->status());
            return;
        }

        $json = $response->json();
        $skinsData = $json['data'] ?? [];
        $this->info('Data fetched successfully. Updating database...');

        $bar = $this->output->createProgressBar(count($skinsData));
        $bar->start();

        foreach ($skinsData as $skinData) {
            $marketName = $skinData['market_name'] ?? null;

            if (!$marketName) {
                $bar->advance();
                continue;
            }

            // 1. FILTRY
            // Wywalamy wszystko co nie ma " | " (skrzynki, klucze itp.)
            if (!str_contains($marketName, ' | ')) {
                $bar->advance();
                continue;
            }

            // Odrzucamy przedmioty, które NIE są skinami broni
            $exclude = ['Sticker', 'Music Kit', 'Graffiti', 'Patch', 'Agent', 'Gloves', '★', 'Souvenir', 'Collectible'];
            $shouldSkip = false;
            foreach ($exclude as $badWord) {
                if (str_contains($marketName, $badWord)) {
                    $shouldSkip = true;
                    break;
                }
            }

        
            if ($shouldSkip || !str_contains($marketName, '(')) {
                $bar->advance();
                continue;
            }

            // 2. PARSOWANIE
            $isStatTrak = str_contains($marketName, 'StatTrak™');
            $tempName = str_replace('StatTrak™ ', '', $marketName);

            preg_match('/\((.*?)\)/', $tempName, $matches);
            $condition = $matches[1] ?? null;

            $cleanName = trim(str_replace("($condition)", "", $tempName));
            $parts = explode(' | ', $cleanName);
            
            $weaponName = $parts[0] ?? null;
            $skinName = $parts[1] ?? null;

            // 3. SZUKANIE W BAZIE
            $skin = Skin::where('name', $skinName)
                ->whereHas('weapon', function($query) use ($weaponName) {
                    $query->where('name', $weaponName);
                })->first();

            if (!$skin) {
                $bar->advance();
                continue;
            }

            // 4. ZAPIS CENY
            $skin->prices()->updateOrCreate(
                [
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

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Skins prices updated successfully!');
    }
}