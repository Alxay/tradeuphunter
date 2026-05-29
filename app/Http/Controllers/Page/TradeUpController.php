<?php

namespace App\Http\Controllers\Page;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DataManager;
use App\Models\Skin;
use App\Models\Collection;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class TradeUpController extends Controller
{
    public function tradeUps()
    {
        $dataManager = new DataManager();
        $apiData = $dataManager->getSkins();
        $collections = $dataManager->getCollections();
        $rarities = $dataManager->getRarities();
        return inertia('tradeUps/index', compact('apiData', 'collections', 'rarities'));        
    }

    public function skinsList()
    {
        $dataManager = new DataManager();
        $collections = $dataManager->getCollections();
        $rarities = $dataManager->getRarities();
        $apiData = $dataManager->getSkins();
        return inertia('skinsList/index', compact('apiData', 'collections', 'rarities'));        
    }

    public function skinShow(Request $request, $id)
    {
        $parts = explode('-', $id);
        $idOnly = intval($parts[0]);
        $skin = Skin::with(['rarity', 'weapon', 'prices', 'collection'])->findOrFail($idOnly);

        $expectedSlug = \Illuminate\Support\Str::slug(($skin->weapon ? $skin->weapon->name . ' ' : '') . $skin->name);
        $actualSlug = count($parts) > 1 ? implode('-', array_slice($parts, 1)) : '';

        if ($actualSlug !== $expectedSlug) {
            return redirect()->route('skins.show', ['id' => $idOnly . '-' . $expectedSlug], 301);
        }

        // Fetch rarity -1 skins from the same collection (one tier higher, numerically rarity_id - 1)
        $rarityMinus1Skins = [];
        if ($skin->rarity_id > 1) {
            $rarityMinus1Skins = Skin::with(['rarity', 'weapon', 'prices'])
                ->where('collection_id', $skin->collection_id)
                ->where('rarity_id', $skin->rarity_id - 1)
                ->get()
                ->map(function ($s) {
                    $prices = $s->prices->keyBy('condition');
                    $s->priceFT = $prices->get("Field-Tested")?->price_30d ?? $prices->get("Field-Tested")?->price_90d ?? 0;
                    return $s;
                });
        }

        // Fetch rarity +1 skins from the same collection (one tier lower, numerically rarity_id + 1)
        $rarityPlus1Skins = [];
        if ($skin->rarity_id < 6) {
            $rarityPlus1Skins = Skin::with(['rarity', 'weapon', 'prices'])
                ->where('collection_id', $skin->collection_id)
                ->where('rarity_id', $skin->rarity_id + 1)
                ->get()
                ->map(function ($s) {
                    $prices = $s->prices->keyBy('condition');
                    $s->priceFT = $prices->get("Field-Tested")?->price_30d ?? $prices->get("Field-Tested")?->price_90d ?? 0;
                    return $s;
                });
        }

        return inertia('skins/show', [
            'skin' => $skin,
            'rarityMinus1Skins' => $rarityMinus1Skins,
            'rarityPlus1Skins' => $rarityPlus1Skins
        ]);
    }

    public function collectionShow(Request $request, $id)
    {
        $parts = explode('-', $id);
        $idOnly = intval($parts[0]);
        $collection = Collection::findOrFail($idOnly);

        $expectedSlug = \Illuminate\Support\Str::slug($collection->name);
        $actualSlug = count($parts) > 1 ? implode('-', array_slice($parts, 1)) : '';

        if ($actualSlug !== $expectedSlug) {
            return redirect()->route('collections.show', ['id' => $idOnly . '-' . $expectedSlug], 301);
        }

        // Fetch all skins in the collection with prices, rarity, and weapon
        $skins = Skin::with(['rarity', 'weapon', 'prices'])
            ->where('collection_id', $idOnly)
            ->get()
            ->map(function ($skin) {
                // Attach all prices for the skin to facilitate front-end filtering
                $prices = $skin->prices;
                $stPrices = $prices->where('is_stattrak', true)->keyBy('condition');
                $nonStPrices = $prices->where('is_stattrak', false)->keyBy('condition');

                $skin->priceBS = $nonStPrices->get("Battle-Scarred") ?->price_30d ?? $nonStPrices->get("Battle-Scarred") ?->price_90d;
                $skin->priceWW = $nonStPrices->get("Well-Worn") ?->price_30d ?? $nonStPrices->get("Well-Worn") ?->price_90d;
                $skin->priceFT = $nonStPrices->get("Field-Tested") ?->price_30d ?? $nonStPrices->get("Field-Tested") ?->price_90d;
                $skin->priceMW = $nonStPrices->get("Minimal Wear") ?->price_30d ?? $nonStPrices->get("Minimal Wear") ?->price_90d;
                $skin->priceFN = $nonStPrices->get("Factory New") ?->price_30d ?? $nonStPrices->get("Factory New") ?->price_90d;

                $skin->stPriceBS = $stPrices->get("Battle-Scarred") ?->price_30d ?? $stPrices->get("Battle-Scarred") ?->price_90d;
                $skin->stPriceWW = $stPrices->get("Well-Worn") ?->price_30d ?? $stPrices->get("Well-Worn") ?->price_90d;
                $skin->stPriceFT = $stPrices->get("Field-Tested") ?->price_30d ?? $stPrices->get("Field-Tested") ?->price_90d;
                $skin->stPriceMW = $stPrices->get("Minimal Wear") ?->price_30d ?? $stPrices->get("Minimal Wear") ?->price_90d;
                $skin->stPriceFN = $stPrices->get("Factory New") ?->price_30d ?? $stPrices->get("Factory New") ?->price_90d;

                return $skin;
            });

        return inertia('collections/show', [
            'collection' => $collection,
            'skins' => $skins
        ]);
    }

    public function sitemap()
    {
        $sitemap = Sitemap::create();
        $host = request()->getHost();
        if ($host && (str_contains($host, 'localhost') || str_contains($host, '127.0.0.1') || str_ends_with($host, '.test'))) {
            $baseUrl = rtrim(config('app.url', 'http://tradeuphunter.test'), '/');
        } else {
            $baseUrl = 'https://alxay.ninja';
        }

        // Home
        $sitemap->add(Url::create("{$baseUrl}/")
            ->setPriority(1.0)
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY));

        // Skins Database
        $sitemap->add(Url::create("{$baseUrl}/skins")
            ->setPriority(0.9)
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY));

        // Simulator
        $sitemap->add(Url::create("{$baseUrl}/tradeups")
            ->setPriority(0.9)
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY));

        // Add collections
        $collections = Collection::all();
        foreach ($collections as $collection) {
            $slug = \Illuminate\Support\Str::slug($collection->name);
            $sitemap->add(Url::create("{$baseUrl}/collection/{$collection->id}-{$slug}")
                ->setPriority(0.8)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setLastModificationDate(\Carbon\Carbon::now()));
        }

        // Add skins
        $skins = Skin::with('weapon')->get();
        foreach ($skins as $skin) {
            $slug = \Illuminate\Support\Str::slug(($skin->weapon ? $skin->weapon->name . ' ' : '') . $skin->name);
            $sitemap->add(Url::create("{$baseUrl}/skin/{$skin->id}-{$slug}")
                ->setPriority(0.6)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setLastModificationDate(\Carbon\Carbon::now()));
        }

        return response($sitemap->render(), 200)
            ->header('Content-Type', 'text/xml');
    }
}
