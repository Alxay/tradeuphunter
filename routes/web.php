<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Page\TradeUpController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('tradeups', [TradeUpController::class, 'tradeUps'])->name('tradeups.index');
    Route::get('skins', [TradeUpController::class, 'skinsList'])->name('skins.index');
});



require __DIR__.'/settings.php';
