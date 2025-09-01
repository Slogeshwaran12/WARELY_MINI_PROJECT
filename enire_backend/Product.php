<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image',        // For admin file uploads
        'image_url',    // For direct URLs  
        'is_available',
    ];

    // Accessor for display image URL - prioritizes image_url over image
    public function getDisplayImageUrlAttribute()
    {
        // First check if image_url exists (direct URL)
        if ($this->image_url) {
            return $this->image_url;
        }
        
        // Then check if image exists (file upload)
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        
        return null;
    }
}