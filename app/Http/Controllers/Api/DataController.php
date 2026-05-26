<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DataManager;

class DataController extends Controller
{
    public function getSkins(Request $request){
        $validated = $request->validate([
            'page' => 'nullable|integer|min:1',
            'collection' => 'nullable|string|min:1',
            'rarity' => 'nullable|string|in:1,2,3,4,5,6',
            'condition' => 'nullable|string|in:Factory New,Minimal Wear,Field-Tested,Well-Worn,Battle-Scarred',
            'statTrak' => 'nullable',
            'search' => 'nullable|string|max:100',
        ]);

        $page = $validated['page'] ?? 1;
        $collection = $validated['collection'] ?? null;
        $rarity = $validated['rarity'] ?? null;
        $condition = $validated['condition'] ?? 'Minimal Wear';
        $statTrak = isset($validated['statTrak']) ? filter_var($validated['statTrak'], FILTER_VALIDATE_BOOLEAN) : false;
        $search = $validated['search'] ?? null;
        $perPage = 40;

        $dataManager = new DataManager();
        return $dataManager->getSkins($page, $perPage, $condition, $collection, $rarity, $statTrak, $search);
    }

    public function calculateTradeUp(Request $request){
        $validated = $request->validate([
            'avgInputFloat' => 'required|numeric|min:0|max:1',
            'rarity' => 'required|integer|min:1|max:6',
            'statTrak' => 'nullable',
            'collections' => 'required|array|size:10',
            'collections.*' => 'integer|min:1',
        ]);

        $avgInputFloat = $validated['avgInputFloat'];
        $rarity = $validated['rarity'];
        $collections = $validated['collections'];
        $statTrak = isset($validated['statTrak']) ? filter_var($validated['statTrak'], FILTER_VALIDATE_BOOLEAN) : false;
        
        $dataManager = new DataManager();
        return $dataManager->calculateTradeUp($avgInputFloat, $rarity, $collections, $statTrak);
    }
}
