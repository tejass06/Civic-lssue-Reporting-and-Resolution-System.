// lib/screens/report_detail_screen.dart

import 'package:flutter/material.dart';
import 'package:pragatisetu/models/report.dart';

class ReportDetailScreen extends StatelessWidget {
  final Report report;

  const ReportDetailScreen({super.key, required this.report});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Details'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Type: ${report.type}', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              Text('Location: ${report.location}', style: Theme.of(context).textTheme.bodyLarge),
              const SizedBox(height: 8),
              Text('Description: ${report.description}', style: Theme.of(context).textTheme.bodyLarge),
              const SizedBox(height: 8),
              Text('Status: ${report.status}', style: Theme.of(context).textTheme.bodyLarge),
              const SizedBox(height: 8),
              Text('Submitted On: ${report.createdAt.toLocal()}', style: Theme.of(context).textTheme.bodyLarge),
              if (report.imageUrl.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 16.0),
                  child: Image.network(report.imageUrl),
                ),
            ],
          ),
        ),
      ),
    );
  }
}