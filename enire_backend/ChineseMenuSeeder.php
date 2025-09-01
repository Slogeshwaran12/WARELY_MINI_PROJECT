<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\Schema;

class ChineseMenuSeeder extends Seeder
{
    public function run(): void
    {
        // Check which image column exists after all migrations
        $hasImage = Schema::hasColumn('products', 'image');
        $hasImageUrl = Schema::hasColumn('products', 'image_url');

        $items = [
            // Main Dishes
            [
                'name' => 'Kung Pao Chicken', 
                'description' => 'Stir-fried chicken with peanuts, chili peppers, and vegetables in a savory-sweet sauce.', 
                'price' => 8.0,
                'color' => 'FFD700', // Gold
                'category' => 'main'
            ],
            [
                'name' => 'Sweet and Sour Pork', 
                'description' => 'Crispy pork chunks coated in a tangy sauce with pineapple and bell peppers.', 
                'price' => 9.0,
                'color' => 'FF6B6B', // Red
                'category' => 'main'
            ],
            [
                'name' => 'Mapo Tofu', 
                'description' => 'Silken tofu in a spicy Sichuan pepper sauce with minced meat.', 
                'price' => 7.0,
                'color' => 'FD79A8', // Pink
                'category' => 'main'
            ],
            [
                'name' => 'Peking Duck', 
                'description' => 'Roasted duck with crispy skin, served with pancakes, scallions, and hoisin sauce.', 
                'price' => 20.0,
                'color' => '8B4513', // Brown
                'category' => 'premium'
            ],
            [
                'name' => 'Chow Mein', 
                'description' => 'Stir-fried noodles with vegetables and meat or tofu.', 
                'price' => 6.5,
                'color' => 'DDA0DD', // Plum
                'category' => 'noodles'
            ],
            [
                'name' => 'Hot Pot', 
                'description' => 'DIY meal with meats, veggies, and noodles cooked in a simmering broth.', 
                'price' => 15.0,
                'color' => 'FF4500', // Orange Red
                'category' => 'premium'
            ],
            [
                'name' => 'Dim Sum Platter', 
                'description' => 'Assorted bite-sized dumplings, buns, and rolls.', 
                'price' => 10.0,
                'color' => 'FFEAA7', // Light Yellow
                'category' => 'appetizer'
            ],
            [
                'name' => 'Beef and Broccoli', 
                'description' => 'Tender beef slices stir-fried with broccoli in a garlic soy sauce.', 
                'price' => 8.0,
                'color' => '4ECDC4', // Turquoise
                'category' => 'main'
            ],
            [
                'name' => 'Egg Fried Rice', 
                'description' => 'Classic rice stir-fried with egg, scallions, and soy sauce.', 
                'price' => 5.0,
                'color' => '45B7D1', // Sky Blue
                'category' => 'rice'
            ],
            [
                'name' => 'Sichuan Spicy Noodles', 
                'description' => 'Noodles in a fiery chili oil sauce with garlic and sesame.', 
                'price' => 6.0,
                'color' => 'DC143C', // Crimson
                'category' => 'noodles'
            ],

            // Drinks
            [
                'name' => 'Soy Milk', 
                'description' => 'Smooth, slightly sweet drink made from soybeans. Often served warm.', 
                'price' => 1.0,
                'color' => 'F5F5DC', // Beige
                'category' => 'beverage'
            ],
            [
                'name' => 'Pear Juice', 
                'description' => 'Refreshing and subtly sweet juice made from Asian pears.', 
                'price' => 1.5,
                'color' => '98FB98', // Pale Green
                'category' => 'beverage'
            ],
            [
                'name' => 'Bubble Milk Tea', 
                'description' => 'Sweet milk tea with chewy tapioca pearls.', 
                'price' => 3.0,
                'color' => 'CD853F', // Peru
                'category' => 'beverage'
            ],

            // Snacks
            [
                'name' => 'White Rabbit Candy', 
                'description' => 'Iconic creamy milk-flavored candy wrapped in edible rice paper.', 
                'price' => 1.0,
                'color' => 'FFFFFF', // White
                'category' => 'snack'
            ],
            [
                'name' => 'Haw Flakes', 
                'description' => 'Thin sweet-sour discs made from hawthorn fruit.', 
                'price' => 0.5,
                'color' => 'DC143C', // Crimson
                'category' => 'snack'
            ],
            [
                'name' => 'Salt-Baked Chicken Eggs', 
                'description' => 'Richly flavored eggs baked in hot salt crystals.', 
                'price' => 1.5,
                'color' => 'F4A460', // Sandy Brown
                'category' => 'snack'
            ],
            [
                'name' => 'Mimi Shrimp Strips', 
                'description' => 'Crunchy strips with a savory shrimp taste.', 
                'price' => 1.5,
                'color' => 'FFA07A', // Light Salmon
                'category' => 'snack'
            ],
            [
                'name' => 'Dried Mango Slices', 
                'description' => 'Sweet and tangy dried fruit snack.', 
                'price' => 2.5,
                'color' => 'FFB347', // Peach
                'category' => 'snack'
            ],
        ];

        foreach ($items as $item) {
            // Create the product data array
            $productData = [
                'name'         => $item['name'],
                'description'  => $item['description'],
                'price'        => $item['price'],
                'is_available' => true,
            ];

            // UPDATED: Match your actual file naming convention
            // Your files are like: "Beef and Broccoli.jpeg"
            // So we use the exact product name as filename
            $filename = $item['name'];
            
            // Try common image extensions (including jpeg which you're using)
            $possibleExtensions = ['jpeg', 'jpg', 'png', 'webp'];
            $imagePath = null;
            
            foreach ($possibleExtensions as $ext) {
                $testPath = "products/{$filename}.{$ext}";
                if (file_exists(storage_path("app/public/{$testPath}"))) {
                    $imagePath = $testPath;
                    $this->command->info("✅ Found image: {$testPath}");
                    break;
                }
            }
            
            // If no local image found, use placeholder as fallback
            if (!$imagePath) {
                $imageText = str_replace(' ', '+', $item['name']);
                $imagePath = "https://via.placeholder.com/300x200/{$item['color']}/000000?text={$imageText}";
                $this->command->warn("❌ No image found for: {$item['name']}, using placeholder");
            }
            
            // Add image data based on available columns
            if ($hasImage && !$hasImageUrl) {
                // Only image column exists (final state after migration 5)
                $productData['image'] = $imagePath;
            } elseif (!$hasImage && $hasImageUrl) {
                // Only image_url column exists
                $productData['image_url'] = $imagePath;
            } elseif ($hasImage && $hasImageUrl) {
                // Both columns exist (before migration 5 runs)
                $productData['image'] = $imagePath;
                $productData['image_url'] = $imagePath;
            }

            Product::create($productData);
        }

        $this->command->info('Created ' . count($items) . ' Chinese menu items!');
    }
}