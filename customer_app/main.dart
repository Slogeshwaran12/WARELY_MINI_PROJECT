import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:marquee/marquee.dart';

void main() {
  runApp(const QRApp());
}

class QRApp extends StatelessWidget {
  const QRApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'QR Code App',
      theme: ThemeData(
        primaryColor: Colors.yellow[700],
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.yellow,
          foregroundColor: Colors.black,
        ),
      ),
      home: const QRPage(),
    );
  }
}

class QRPage extends StatelessWidget {
  const QRPage({super.key});

  final String qrData = "https://logeshwarely.netlify.app/";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.yellow[50],
      appBar: AppBar(
        title: const Text("Warely SG QR"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // Marquee text
            SizedBox(
              height: 40,
              child: Marquee(
                text: '📱 Scan & Book Orders! 🛒🍔🥗🥤',
                style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87),
                scrollAxis: Axis.horizontal,
                blankSpace: 50.0,
                velocity: 80.0,
                pauseAfterRound: const Duration(seconds: 1),
                startPadding: 10.0,
                accelerationDuration: const Duration(seconds: 1),
                accelerationCurve: Curves.linear,
                decelerationDuration: const Duration(seconds: 1),
                decelerationCurve: Curves.easeOut,
              ),
            ),
            const SizedBox(height: 40),

            // QR code card
            Card(
              elevation: 8,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20)),
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: QrImageView(
                  data: qrData,
                  version: QrVersions.auto,
                  size: 250.0,
                  gapless: false,
                ),
              ),
            ),
            const SizedBox(height: 30),

            // Instruction text
            const Text(
              '🎯 Scan this QR code to open Warely SG app and place your orders!',
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87),
            ),
          ],
        ),
      ),
    );
  }
}
