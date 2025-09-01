<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Only add column if it doesn't exist already
        if (!Schema::hasColumn('products', 'image')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('image')->nullable()->after('price');
            });
        }
    }

    public function down(): void
    {
        // Only drop column if it exists
        if (Schema::hasColumn('products', 'image')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('image');
            });
        }
    }
};