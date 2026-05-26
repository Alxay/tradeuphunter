<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Page\TradeUpController;

Route::redirect('/login', '/');
Route::redirect('/register', '/');
Route::redirect('/forgot-password', '/');
Route::redirect('/reset-password', '/');
Route::redirect('/two-factor-challenge', '/');

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});



Route::get('skins', [TradeUpController::class, 'skinsList'])->name('skins.index');
Route::get('tradeups', [TradeUpController::class, 'tradeUps'])->name('tradeups.index');

require __DIR__.'/settings.php';
