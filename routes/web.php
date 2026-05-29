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

Route::inertia('/privacy', 'privacy')->name('privacy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('sitemap.xml', [TradeUpController::class, 'sitemap'])->name('sitemap');

Route::get('skins', [TradeUpController::class, 'skinsList'])->name('skins.index');
Route::get('skin/{id}', [TradeUpController::class, 'skinShow'])
    ->name('skins.show')
    ->where('id', '[0-9]+(-[a-z0-9\-]+)?');

Route::get('collection/{id}', [TradeUpController::class, 'collectionShow'])
    ->name('collections.show')
    ->where('id', '[0-9]+(-[a-z0-9\-]+)?');

Route::get('tradeups', [TradeUpController::class, 'tradeUps'])->name('tradeups.index');

require __DIR__.'/settings.php';
