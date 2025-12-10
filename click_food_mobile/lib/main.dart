import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MaterialApp(home: ClickFoodWebView()));
}

class ClickFoodWebView extends StatefulWidget {
  const ClickFoodWebView({super.key});

  @override
  State<ClickFoodWebView> createState() => _ClickFoodWebViewState();
}

class _ClickFoodWebViewState extends State<ClickFoodWebView> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(

        Uri.parse('http://10.0.2.2:3000'), 
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: WebViewWidget(controller: controller),
      ),
    );
  }
}