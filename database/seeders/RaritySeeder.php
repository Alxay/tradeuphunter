<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rarity;
use Illuminate\Support\Facades\Schema;

class RaritySeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        Rarity::truncate();

        $rarities = [
            ['name' => 'Covert',           'color_hex' => '#eb4b4b', 'api_id' => 'rarity_ancient_weapon'],
            ['name' => 'Classified',       'color_hex' => '#d32ce6', 'api_id' => 'rarity_legendary_weapon'],
            ['name' => 'Restricted',       'color_hex' => '#8847ff', 'api_id' => 'rarity_mythical_weapon'],
            ['name' => 'Mil-Spec Grade',   'color_hex' => '#4b69ff', 'api_id' => 'rarity_rare_weapon'],
            ['name' => 'Industrial Grade', 'color_hex' => '#5e98d9', 'api_id' => 'rarity_uncommon_weapon'],
            ['name' => 'Consumer Grade',   'color_hex' => '#b0c3d9', 'api_id' => 'rarity_common_weapon'],
        ];

        foreach ($rarities as $rarity) {
            Rarity::create($rarity);
        }
        Schema::enableForeignKeyConstraints();
    }
}