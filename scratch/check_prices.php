<?php
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Skin;

$names = ['Head Shot', 'Temukau', 'Duality', 'Wicked Sick', 'Wild Child'];

foreach ($names as $name) {
    $skin = Skin::with('prices')->where('name', 'like', "%$name%")->first();
    if ($skin) {
        echo "Skin: " . $skin->name . "\n";
        $ftNormal = $skin->prices->where('condition', 'Field-Tested')->where('is_stattrak', false)->first();
        $ftST = $skin->prices->where('condition', 'Field-Tested')->where('is_stattrak', true)->first();
        echo "  Normal FT: " . ($ftNormal ? ($ftNormal->price_30d ?? $ftNormal->price_90d) : 'N/A') . "\n";
        echo "  StatTrak FT: " . ($ftST ? ($ftST->price_30d ?? $ftST->price_90d) : 'N/A') . "\n";
    }
}
