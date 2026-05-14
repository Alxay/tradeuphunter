<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    protected $fillable = ['name', 'api_id','image_url'];

    public function skins()
    {
        return $this->hasMany(Skin::class);
    }
}
