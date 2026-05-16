<?php

namespace App\Http\Controllers\Page;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DataManager;

class TradeUpController extends Controller
{
    public function index()
    {
        $dataManager = new DataManager();
        $apiData = $dataManager->getSkins();
        $collections = $dataManager->getCollections();
        $rarities = $dataManager->getRarities();
        return inertia('tradeUps/index', compact('apiData', 'collections', 'rarities'));        
    }
}
