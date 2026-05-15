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
        return inertia('tradeUps/index', compact('apiData'));        
    }
}
