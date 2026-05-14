<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rarities', function (Blueprint $table) {

            // "id": "rarity_legendary_weapon",
            // "name": "Classified",
            // "color": "#d32ce6"

            $table->id();
            $table->string('name')->unique();
            $table->string('color_hex'); 
            $table->string('api_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rarities');
    }
};
