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
        Schema::create('prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skin_id')->constrained()->onDelete('cascade');
            $table->string('condition');
            $table->boolean('is_stattrak')->default(false);
            $table->decimal('price_24h', 8, 2);
            $table->decimal('price_7d', 8, 2);
            $table->decimal('price_30d', 8, 2);
            $table->decimal('price_90d', 8, 2);
            $table->unsignedInteger('liquidity')->default(0);
            $table->boolean('is_unstable')->default(false);
            $table->string('provider')->default('steam');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prices');
    }
};
