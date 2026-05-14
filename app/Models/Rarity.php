<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rarity extends Model
{
    protected $fillable = ['name', 'color_hex','api_id'];

    public function skins()
    {
        return $this->hasMany(Skin::class);
    }
}