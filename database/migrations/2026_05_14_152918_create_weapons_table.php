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
        Schema::create('weapons', function (Blueprint $table) {

            //"id": "weapon_ak47",
            // "weapon_id": 7,
            // "name": "AK-47"

            $table->id();
            $table->string('name')->unique();
            $table->string('api_id')->unique();
            $table->unsignedInteger('weapon_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weapons');
    }
};
