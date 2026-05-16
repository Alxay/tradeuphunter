<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DataManager;

class DataController extends Controller
{
    public function getSkins(Request $request){
        $page = $request->query('page', 1);
        $collection = $request->query('collection', null);
        $rarity = $request->query('rarity', null);
        $perPage = 40;

        $dataManager = new DataManager();
        return $dataManager->getSkins($page, $perPage, $collection, $rarity);


        // $skins = Skin::with(['rarity'])->paginate($perPage, ['*'], 'page', $page);

        // return response()->json($skins);
    }
}
