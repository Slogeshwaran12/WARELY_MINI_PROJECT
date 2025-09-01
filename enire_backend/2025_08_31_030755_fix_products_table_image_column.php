<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop image_url if it exists and ensure image column exists
            if (Schema::hasColumn('products', 'image_url')) {
                $table->dropColumn('image_url');
            }
            if (!Schema::hasColumn('products', 'image')) {
                $table->string('image')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'image')) {
                $table->dropColumn('image');
            }
            if (!Schema::hasColumn('products', 'image_url')) {
                $table->string('image_url')->nullable();
            }
        });
    }
};