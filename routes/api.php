<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DataController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/skins', [DataController::class, 'getSkins'])->name('api.getSkins');
Route::get('/tradeup', [DataController::class, 'calculateTradeUp'])->name('api.calculateTradeUp');

