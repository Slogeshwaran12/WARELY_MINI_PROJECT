<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddImageAndIsAvailableToProductsTable extends Migration
{
    public function up()
    {
        // Check if columns don't exist before adding them
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'image')) {
                $table->string('image')->nullable()->after('price');
            }
            if (!Schema::hasColumn('products', 'is_available')) {
                $table->boolean('is_available')->default(true)->after('image');
            }
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'image')) {
                $table->dropColumn('image');
            }
            if (Schema::hasColumn('products', 'is_available')) {
                $table->dropColumn('is_available');
            }
        });
    }
}