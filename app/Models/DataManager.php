<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Skin;
use App\Models\Collection;
use App\Models\Rarity;

class DataManager extends Model
{
    public function getSkins($page = 1, $perPage = 40, $condition = "Minimal Wear", $collection = null, $rarity = null, $statTrak = false){
        $result = Skin::with(['rarity'])
            ->when($collection, function ($query) use ($collection) {
                return $query->where('collection_id', $collection);
            })
            ->when($rarity, function ($query) use ($rarity) {
                return $query->where('rarity_id', $rarity);
            })
            ->orderBy('rarity_id', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        $result->getCollection()->transform(function ($skin) use ($condition, $statTrak) {
            $price = $skin->prices()
                ->where('condition', $condition)
                ->where('is_stattrak', $statTrak)
                ->first();
            $skin->price = $price ? $price->price_30d : null;
            $skin->statTrak = $statTrak;
            return $skin;
        });

        return $result;
    }
    public function getCollections(){
        $collections = Collection::all();
        return $collections;
    }
    public function getRarities(){
        $rarities = Rarity::all();
        return $rarities;
    }
private function getConditionFromFloat(float $averageInputFloat, float $minFloat, float $maxFloat) {
    // 1. Obliczamy finalny float broni z kontraktu ze wzoru
    $outputFloat = ($maxFloat - $minFloat) * $averageInputFloat + $minFloat;
    
    // 2. Ustalamy stan (Condition) na podstawie z góry określonych widełek gry
    $condition = 'Unknown';
    
    if ($outputFloat >= 0.00 && $outputFloat < 0.07) {
        $condition = 'Factory New';
    } elseif ($outputFloat >= 0.07 && $outputFloat < 0.15) {
        $condition = 'Minimal Wear';
    } elseif ($outputFloat >= 0.15 && $outputFloat < 0.38) {
        $condition = 'Field-Tested';
    } elseif ($outputFloat >= 0.38 && $outputFloat < 0.45) {
        $condition = 'Well-Worn';
    } elseif ($outputFloat >= 0.45 && $outputFloat <= 1.00) {
        $condition = 'Battle-Scarred';
    }

    // 3. Zwracamy wynik
    return $condition;
}
    public function calculateTradeUp($avgInputFloat, $rarity, $collections, $statTrak = false)
    {
        $outputRarityId = $rarity -1;
        $outputSkins = Skin::with(['rarity'])
            ->where('rarity_id', $outputRarityId)
            ->whereIn('collection_id', $collections)
            ->get();

        $outputSkins = $outputSkins->map(function ($skin) use ($avgInputFloat, $statTrak) {
            $price = $skin->prices()
                ->where('condition', $this->getConditionFromFloat($avgInputFloat, $skin['min_float'], $skin['max_float']))
                ->where('is_stattrak', $statTrak)
                ->first();
            $skin->price = $price ? $price->price_30d : null;
            $skin->statTrak = $statTrak;
            return $skin;
        });

        return $outputSkins;
        
    }
}
