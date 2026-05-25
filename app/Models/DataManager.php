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
        //pobieramy cene dla kazdej z kondycji
        $result->getCollection()->transform(function ($skin) use ($condition, $statTrak) {
            $prices = $skin->prices()
                ->where('is_stattrak', $statTrak)
                ->get()
                ->keyBy('condition');
            //jezeli cena 30d jest nul bierzemy z 90d
            $skin->priceBS = $prices->get("Battle-Scarred") ?->price_30d ?? $prices->get("Battle-Scarred") ?->price_90d;
            $skin->priceWW = $prices->get("Well-Worn") ?->price_30d ?? $prices->get("Well-Worn") ?->price_90d;
            $skin->priceFT = $prices->get("Field-Tested") ?->price_30d ?? $prices->get("Field-Tested") ?->price_90d;
            $skin->priceMW = $prices->get("Minimal Wear") ?->price_30d ?? $prices->get("Minimal Wear") ?->price_90d;
            $skin->priceFN = $prices->get("Factory New") ?->price_30d ?? $prices->get("Factory New") ?->price_90d;
            //$skin->price = $price ? $price->price_30d : null;
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
    public function calculateTradeUp($avgInputFloat, $rarity, $collections, $statTrak = false)
    {
        $outputRarityId = $rarity -1;
        $inputCollectionCounts = array_count_values($collections);
        $totalInputSkins = array_sum($inputCollectionCounts) ?: 1;

        $outputSkins = Skin::with(['rarity'])
            ->where('rarity_id', $outputRarityId)
            ->whereIn('collection_id', $collections)
            ->get();

        $outputCountsByCollection = $outputSkins
            ->groupBy('collection_id')
            ->map(fn ($skins) => $skins->count());

        $outputSkins = $outputSkins->map(function ($skin) use ($statTrak, $inputCollectionCounts, $outputCountsByCollection, $totalInputSkins) {
            $prices = $skin->prices()
                ->where('is_stattrak', $statTrak)
                ->get()
                ->keyBy('condition');
            
            $skin->priceBS = $prices->get("Battle-Scarred") ?->price_30d ?? $prices->get("Battle-Scarred") ?->price_90d;
            $skin->priceWW = $prices->get("Well-Worn") ?->price_30d ?? $prices->get("Well-Worn") ?->price_90d;
            $skin->priceFT = $prices->get("Field-Tested") ?->price_30d ?? $prices->get("Field-Tested") ?->price_90d;
            $skin->priceMW = $prices->get("Minimal Wear") ?->price_30d ?? $prices->get("Minimal Wear") ?->price_90d;
            $skin->priceFN = $prices->get("Factory New") ?->price_30d ?? $prices->get("Factory New") ?->price_90d;
            $skin->statTrak = $statTrak;
            $collectionChance = (($inputCollectionCounts[$skin->collection_id] ?? 0) / $totalInputSkins) * 100;
            $outputCount = $outputCountsByCollection->get($skin->collection_id, 1);
            $skin->collectionChance = $collectionChance;
            $skin->chance = $outputCount > 0 ? $collectionChance / $outputCount : 0;
            return $skin;
        });

        return $outputSkins;
        
    }

    
}
