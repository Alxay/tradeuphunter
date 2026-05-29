<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Weapon;
use App\Models\Rarity;
use App\Models\Collection;
use App\Models\Price;


class Skin extends Model
{
    protected $fillable = [
        'weapon_id', 
        'rarity_id', 
        'name', 
        'collection_id',
        'image_url', 
        'min_float', 
        'max_float'
    ];
    public function weapon()
    {
        return $this->belongsTo(Weapon::class);
    }

    public function rarity()
    {
        return $this->belongsTo(Rarity::class);
    }

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    public function prices()
    {
        return $this->hasMany(Price::class);
    }
}