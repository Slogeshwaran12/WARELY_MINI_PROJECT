import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(const CustomerApp());
}

// Product model
class Product {
  final int id;
  final String name;
  final double price;
  final String? imageUrl;

  Product({required this.id, required this.name, required this.price, this.imageUrl});

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      price: _parsePrice(json['price']),
      imageUrl: json['image_url'],
    );
  }

  static double _parsePrice(dynamic price) {
    if (price is num) {
      return price.toDouble();
    } else if (price is String) {
      return double.parse(price);
    } else {
      throw Exception('Invalid price format: $price');
    }
  }
}

// Cart provider (simple)
class CartProvider extends ChangeNotifier {
  final Map<int, int> _items = {};

  Map<int, int> get items => _items;

  void addItem(Product product) {
    _items[product.id] = (_items[product.id] ?? 0) + 1;
    notifyListeners();
  }

  void removeItem(Product product) {
    _items.remove(product.id);
    notifyListeners();
  }

  void increaseQty(Product product) {
    _items[product.id] = (_items[product.id] ?? 0) + 1;
    notifyListeners();
  }

  void decreaseQty(Product product) {
    if (_items.containsKey(product.id) && _items[product.id]! > 1) {
      _items[product.id] = _items[product.id]! - 1;
    } else {
      _items.remove(product.id);
    }
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}

// API Service
class ApiService {
  // Use the proper base URL for platform
  // Android emulator: 10.0.2.2
  // Web: 127.0.0.1
  // Physical device: your LAN IP like 192.168.x.x
  static const String baseUrl = "http://10.0.2.2:8000/api";

  static Future<List<Product>> getProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Handle both array and object with data field
        List<dynamic> productList;
        if (data is List) {
          productList = data;
        } else if (data is Map && data.containsKey('data')) {
          productList = data['data'];
        } else {
          throw Exception('Unexpected response format');
        }
        
        return productList.map((p) => Product.fromJson(p)).toList();
      } else {
        throw Exception('Server returned ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to load products: $e');
    }
  }

  static Future<void> placeOrder(List<Map<String, dynamic>> items) async {
    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'items': items}),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to place order');
    }
  }
}

// Main App
class CustomerApp extends StatelessWidget {
  const CustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Warely_SG',
      theme: ThemeData(primarySwatch: Colors.yellow),
      home: const MenuPage(),
    );
  }
}

// Menu Page
class MenuPage extends StatefulWidget {
  const MenuPage({super.key});

  @override
  State<MenuPage> createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  List<Product> products = [];
  bool loading = true;
  String? error;
  final CartProvider cartProvider = CartProvider();

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      products = await ApiService.getProducts();
      setState(() => loading = false);
    } catch (e) {
      setState(() {
        loading = false;
        error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Center(
            child: Text(
          "Warely_SG",
          style: TextStyle(fontWeight: FontWeight.bold),
        )),
        backgroundColor: Colors.yellow,
        foregroundColor: Colors.black,
        actions: [
          IconButton(
              icon: const Icon(Icons.shopping_cart, color: Colors.black),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) =>
                          CartPage(cartProvider: cartProvider, products: products)),
                );
              })
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      const Text(
                        'Error loading products',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Text(
                          error!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: Colors.red),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: fetchProducts,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : products.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.shopping_bag_outlined, size: 64, color: Colors.grey),
                          const SizedBox(height: 16),
                          const Text(
                            'No products available',
                            style: TextStyle(fontSize: 18),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: fetchProducts,
                            child: const Text('Refresh'),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: fetchProducts,
                      child: ListView.builder(
                        itemCount: products.length,
                        itemBuilder: (context, index) {
                          final product = products[index];
                          final qty = cartProvider.items[product.id] ?? 0;
                          return Card(
                            margin: const EdgeInsets.all(10),
                            child: ListTile(
                              leading: product.imageUrl != null
                                  ? ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        product.imageUrl!,
                                        width: 60,
                                        height: 60,
                                        fit: BoxFit.cover,
                                        errorBuilder: (context, error, stackTrace) {
                                          return Container(
                                            width: 60,
                                            height: 60,
                                            color: Colors.grey[300],
                                            child: const Icon(Icons.image_not_supported),
                                          );
                                        },
                                      ),
                                    )
                                  : Container(
                                      width: 60,
                                      height: 60,
                                      color: Colors.grey[300],
                                      child: const Icon(Icons.image),
                                    ),
                              title: Text(product.name),
                              subtitle: Text("\$${product.price.toStringAsFixed(2)}"),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.remove),
                                    onPressed: qty > 0
                                        ? () => setState(() {
                                              cartProvider.decreaseQty(product);
                                            })
                                        : null,
                                  ),
                                  Text(qty.toString()),
                                  IconButton(
                                    icon: const Icon(Icons.add),
                                    onPressed: () => setState(() {
                                      cartProvider.increaseQty(product);
                                    }),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}

// Cart Page
class CartPage extends StatelessWidget {
  final CartProvider cartProvider;
  final List<Product> products;
  const CartPage({super.key, required this.cartProvider, required this.products});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Cart"),
        backgroundColor: Colors.yellow,
        foregroundColor: Colors.black,
      ),
      body: cartProvider.items.isEmpty
          ? const Center(child: Text("Cart is empty"))
          : Column(
              children: [
                Expanded(
                  child: ListView(
                    children: cartProvider.items.entries.map((entry) {
                      final product =
                          products.firstWhere((p) => p.id == entry.key);
                      final qty = entry.value;
                      return ListTile(
                        leading: product.imageUrl != null
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.network(
                                  product.imageUrl!,
                                  width: 50,
                                  height: 50,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Container(
                                      width: 50,
                                      height: 50,
                                      color: Colors.grey[300],
                                      child: const Icon(Icons.image_not_supported),
                                    );
                                  },
                                ),
                              )
                            : Container(
                                width: 50,
                                height: 50,
                                color: Colors.grey[300],
                                child: const Icon(Icons.image),
                              ),
                        title: Text(product.name),
                        subtitle:
                            Text("\$${(product.price * qty).toStringAsFixed(2)}"),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                                icon: const Icon(Icons.remove),
                                onPressed: () =>
                                    cartProvider.decreaseQty(product)),
                            Text(qty.toString()),
                            IconButton(
                                icon: const Icon(Icons.add),
                                onPressed: () =>
                                    cartProvider.increaseQty(product)),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(15),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.yellow,
                        foregroundColor: Colors.black,
                        minimumSize: const Size.fromHeight(50)),
                    onPressed: () async {
                      final items = cartProvider.items.entries
                          .map((e) =>
                              {"product_id": e.key, "quantity": e.value})
                          .toList();
                      try {
                        await ApiService.placeOrder(items);
                        cartProvider.clearCart();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text("Order placed successfully!")),
                        );
                        Navigator.pop(context);
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Failed: $e")));
                      }
                    },
                    child: const Text("Place Order"),
                  ),
                ),
              ],
            ),
    );
  }
}