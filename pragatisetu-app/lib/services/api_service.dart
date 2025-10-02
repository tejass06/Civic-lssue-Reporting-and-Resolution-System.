// lib/services/api_service.dart

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/report.dart';

class ApiService {
  // Use the correct URL for your device
  static const String _baseUrl = "";

  Future<List<Report>> fetchReports() async {
    final response = await http.get(Uri.parse('$_baseUrl/api/Issues/public'));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Report.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load reports');
    }
  }

  Future<String?> uploadImage(File imageFile) async {
    var request = http.MultipartRequest('POST', Uri.parse('$_baseUrl/api/Upload'));
    request.files.add(await http.MultipartFile.fromPath('file', imageFile.path));
    var res = await request.send();
    if (res.statusCode == 200) {
      var responseBody = await res.stream.bytesToString();
      var jsonResponse = jsonDecode(responseBody);
      return jsonResponse['url'];
    }
    return null;
  }

  Future<void> createReport(Report report) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/api/Issues'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(report.toJson()),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to create report.');
    }
  }
}