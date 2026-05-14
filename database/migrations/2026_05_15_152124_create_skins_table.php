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
        Schema::create('skins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weapon_id')->constrained(); 
            $table->foreignId('rarity_id')->constrained();
            $table->foreignId('collection_id')->constrained();
            $table->string('name');
            $table->decimal('min_float', 3, 2);
            $table->decimal('max_float', 3, 2);
            $table->string('image_url');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skins');
    }
};
