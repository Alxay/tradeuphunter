<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Skin;
use App\Models\Collection;
use App\Models\Rarity;

class DataManager extends Model
{
    public function getSkins($page = 1, $perPage = 40,$collection = null, $rarity = null){
        return Skin::with(['rarity'])
        ->when($collection, function ($query) use ($collection) {
            return $query->where('collection_id', $collection);
        })
        ->when($rarity, function ($query) use ($rarity) {
            return $query->where('rarity_id', $rarity);
        })
        ->orderBy('rarity_id', 'asc')
        ->paginate($perPage, ['*'], 'page', $page);
    }
    public function getCollections(){
        $collections = Collection::all();
        return $collections;
    }
    public function getRarities(){
        $rarities = Rarity::all();
        return $rarities;
    }
}
