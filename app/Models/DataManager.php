<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Skin;

class DataManager extends Model
{
    public function getSkins($page = 1, $perPage = 40){
        $skins = Skin::with(['rarity'])->paginate($perPage, ['*'], 'page', $page);
        return $skins;
    }
}
