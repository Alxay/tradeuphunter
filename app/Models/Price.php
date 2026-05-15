<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $fillable = [
        'skin_id',
        'condition',
        'is_stattrak',
        'price_24h',
        'price_7d',
        'price_30d',
        'price_90d',
        'liquidity',
        'is_unstable',
        'provider',
    ];

    public function skin()
    {
        return $this->belongsTo(Skin::class);
    }
}


