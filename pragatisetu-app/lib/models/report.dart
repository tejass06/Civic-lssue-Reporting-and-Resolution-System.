// lib/models/report.dart

import 'package:flutter/material.dart';

class Report {
  final String? id; 
  final String type;
  final String location;
  final String description;
  final String imageUrl;
  final String status;
  final double? latitude;
  final double? longitude;
  final DateTime createdAt;
  final IconData icon;

  Report({
    this.id, 
    required this.type,
    required this.location,
    required this.description,
    required this.imageUrl,
    required this.status,
    this.latitude,
    this.longitude,
    required this.createdAt,
    required this.icon,
  });

  factory Report.fromJson(Map<String, dynamic> json) {
    return Report(
      id: json['id'] as String?,
      type: json['type'] as String,
      location: json['location'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String,
      status: json['status'] as String,
      latitude: json['latitude'] as double?,
      longitude: json['longitude'] as double?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      icon: _getIconForReportType(json['type'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'location': location,
      'description': description,
      'imageUrl': imageUrl,
      'status': status,
      'latitude': latitude,
      'longitude': longitude,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  static IconData _getIconForReportType(String type) {
    switch (type) {
      case 'Pothole':
        return Icons.dangerous_rounded;
      case 'Garbage Overflow':
        return Icons.delete_forever_rounded;
      case 'Water Leakage':
        return Icons.water_drop_rounded;
      default:
        return Icons.report;
    }
  }
}