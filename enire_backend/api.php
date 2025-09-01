<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;

Route::apiResource('products', ProductController::class);
Route::apiResource('orders', OrderController::class);

// Add this route to serve images with spaces in filenames
Route::get('/images/{filename}', function ($filename) {
    // Decode URL-encoded filename (handles %20 -> space conversion)
    $decodedFilename = urldecode($filename);
    $path = storage_path('app/public/products/' . $decodedFilename);
    
    if (!file_exists($path)) {
        abort(404, 'Image not found');
    }
    
    // Serve the file with proper MIME type and caching headers
    return response()->file($path, [
        'Content-Type' => mime_content_type($path),
        'Cache-Control' => 'public, max-age=3600',
    ]);
})->where('filename', '.*');