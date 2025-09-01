<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();

        $products->transform(function ($product) {
            $product->image_url = $this->getImageUrl($product);
            return $product;
        });

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        $product->image_url = $this->getImageUrl($product);

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $isFileUpload = $request->hasFile('image');
        
        if ($isFileUpload) {
            $validated = $request->validate([
                'name'        => 'required|string|max:255',
                'description' => 'nullable|string',
                'price'       => 'required|numeric',
                'image'       => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ]);

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('products', 'public');
                $validated['image'] = $imagePath;
            }
        } else {
            $validated = $request->validate([
                'name'        => 'required|string|max:255',
                'description' => 'nullable|string',
                'price'       => 'required|numeric',
                'image'       => 'nullable|string',
                'image_url'   => 'nullable|string|url',
            ]);
        }

        $product = Product::create($validated);
        $product->image_url = $this->getImageUrl($product);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $isFileUpload = $request->hasFile('image');

        if ($isFileUpload) {
            $validated = $request->validate([
                'name'        => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price'       => 'sometimes|numeric',
                'image'       => 'sometimes|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ]);

            if ($request->hasFile('image')) {
                if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
                    Storage::disk('public')->delete($product->image);
                }
                
                $imagePath = $request->file('image')->store('products', 'public');
                $validated['image'] = $imagePath;
                $validated['image_url'] = null;
            }
        } else {
            $validated = $request->validate([
                'name'        => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price'       => 'sometimes|numeric',
                'image'       => 'sometimes|string',
                'image_url'   => 'sometimes|string|url',
            ]);
        }

        $product->update($validated);
        $product->image_url = $this->getImageUrl($product);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($product->image);
        }
        
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * FIXED: Use custom image serving route for files with spaces
     */
    private function getImageUrl($product)
    {
        // First check if image_url exists (direct URL)
        if ($product->image_url) {
            return $product->image_url;
        }
        
        // Then check if image exists (file upload)
        if ($product->image) {
            if (filter_var($product->image, FILTER_VALIDATE_URL)) {
                return $product->image;
            }
            
            // FIXED: Use custom API route to serve images with spaces
            $filename = basename($product->image); // Get just the filename
            $encodedFilename = urlencode($filename); // Properly encode for URL
            
            return url('api/images/' . $encodedFilename);
        }
        
        return null;
    }
}