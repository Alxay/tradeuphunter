<?php

use App\Models\Collection;
use App\Models\Rarity;
use App\Models\Skin;
use App\Models\Weapon;

test('login page redirects to home page', function () {
    $response = $this->get('/login');
    $response->assertRedirect('/');
});

test('forgot-password page redirects to home page', function () {
    $response = $this->get('/forgot-password');
    $response->assertRedirect('/');
});

test('tradeup API fails if collections array does not have size 10', function () {
    $response = $this->getJson(route('api.calculateTradeUp', [
        'avgInputFloat' => 0.15,
        'rarity' => 2,
        'collections' => [1, 2, 3], // Only 3 items, validation expects 10
    ]));

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['collections']);
});

test('skins API validates page parameter as integer', function () {
    $response = $this->getJson(route('api.getSkins', [
        'page' => 'abc', // Not an integer
    ]));

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['page']);
});
