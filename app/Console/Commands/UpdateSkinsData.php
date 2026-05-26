<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http; 
use App\Models\Weapon;
use App\Models\Rarity;
use App\Models\Collection;
use App\Models\Skin;

#[Signature('app:update-skins-data')]
#[Description('Updates the skins data by fetching from the external API and updating the database.')]
class UpdateSkinsData extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Connecting to external API to fetch skins data...');
        $response = Http::timeout(5)->get('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json');

        if ($response->failed()) {
            $this->error('Error fetching skins data: ' . $response->status());
            return;
        }

        $skinsData = $response->json();
        $this->info('Data fetched successfully. Updating database...');

        $bar = $this->output->createProgressBar(count($skinsData));
        $bar->start();


        foreach ($skinsData as $item) {
            // We skip items without collections 
            if (empty($item['collections'])) {
                $bar->advance();
                continue;
            }

            // We skip items that are souvenirs
            if (isset($item['souvenir']) && $item['souvenir'] === true) {
                $bar->advance();
                continue;
            }


            // Weapon
            $weapon = \App\Models\Weapon::updateOrCreate(
                ['api_id' => $item['weapon']['id']], 
                [
                    'name' => $item['weapon']['name'],
                    'weapon_id' => $item['weapon']['weapon_id']
                ]
            );

            // Rarity
            // $rarity = \App\Models\Rarity::updateOrCreate(
            //     ['api_id' => $item['rarity']['id']],
            //     [
            //         'name' => $item['rarity']['name'],
            //         'color_hex' => $item['rarity']['color']
            //     ]
            // );
            // ['name' => 'Covert','color_hex' => '#eb4b4b', 'api_id' => 'rarity_ancient_weapon'],
            $rarity = Rarity::where('api_id', $item['rarity']['id'])->first();

            if (!$rarity) {
                $bar->advance();
                continue;
            }

            // Collection
            $collData = $item['collections'][0];
            $collection = \App\Models\Collection::updateOrCreate(
                ['api_id' => $collData['id']],
                [
                    'name' => $collData['name'],
                    'image_url' => $collData['image'] ?? ''
                ]
            );

            // Skin
            \App\Models\Skin::updateOrCreate(
                [
                    'weapon_id' => $weapon->id,
                    'name' => $item['pattern']['name'] ?? 'Null'
                ],
                [
                    'rarity_id' => $rarity->id,
                    'collection_id' => $collection->id,
                    'image_url' => $item['image'],
                    'min_float' => $item['min_float'] ?? 0.00,
                    'max_float' => $item['max_float'] ?? 1.00,
                ]
            );

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Skins data updated successfully!');
        }
}
