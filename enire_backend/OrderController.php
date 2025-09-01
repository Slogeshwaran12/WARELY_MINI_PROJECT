<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index() {
        try {
            $orders = Order::with('items.product')->get();
            return response()->json($orders);
        } catch (\Exception $e) {
            Log::error('Failed to fetch orders: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }

    public function store(Request $request) {
        try {
            $request->validate([
                'items' => 'required|array',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'customer_name' => 'nullable|string',
            ]);

            $order = Order::create([
                'status' => 'pending',
                'customer_name' => $request->customer_name,
                'total' => 0 // Will be calculated later if needed
            ]);

            $total = 0;
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            // Update total if you have product prices
            $order->update(['total' => $total]);

            return response()->json($order->load('items.product'), 201);
        } catch (\Exception $e) {
            Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create order', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(Order $order) {
        try {
            return response()->json($order->load('items.product'));
        } catch (\Exception $e) {
            Log::error('Failed to fetch order: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch order'], 500);
        }
    }

    public function update(Request $request, Order $order) {
        try {
            $request->validate([
                'status' => 'required|in:pending,preparing,completed'
            ]);

            $order->update(['status' => $request->status]);
            return response()->json($order->load('items.product'));
        } catch (\Exception $e) {
            Log::error('Failed to update order: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update order'], 500);
        }
    }
}