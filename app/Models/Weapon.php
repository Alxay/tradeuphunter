<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weapon extends Model
{
    protected $fillable = ['name', 'api_id', 'weapon_id'];

    public function skins()
    {
        return $this->hasMany(Skin::class);
    }
}