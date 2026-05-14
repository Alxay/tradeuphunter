<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    public function skin()
    {
        return $this->belongsTo(Skin::class);
    }
}
