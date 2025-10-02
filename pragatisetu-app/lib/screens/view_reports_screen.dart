import 'package:flutter/material.dart';
import '../models/report.dart';
import '../services/api_service.dart';
import 'report_detail_screen.dart';

class ViewReportsScreen extends StatefulWidget {
  const ViewReportsScreen({super.key});

  @override
  State<ViewReportsScreen> createState() => _ViewReportsScreenState();
}

class _ViewReportsScreenState extends State<ViewReportsScreen> {
  late Future<List<Report>> _reportsFuture;
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _reportsFuture = _apiService.fetchReports(); // Fetch reports when the screen loads
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('All Reports'),
      ),
      // Use FutureBuilder to handle loading/error/success states
      body: FutureBuilder<List<Report>>(
        future: _reportsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (snapshot.hasData && snapshot.data!.isNotEmpty) {
            final reports = snapshot.data!;
            return ListView.builder(
              padding: const EdgeInsets.all(10),
              itemCount: reports.length,
              itemBuilder: (context, index) {
                final report = reports[index];
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  child: ListTile(
                    leading: Icon(report.icon),
                    title: Text(report.type, style: Theme.of(context).textTheme.titleMedium),
                    subtitle: Text(report.location, style: Theme.of(context).textTheme.bodyMedium),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.white38),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ReportDetailScreen(report: report),
                        ),
                      );
                    },
                  ),
                );
              },
            );
          }
          return const Center(child: Text('No reports found.'));
        },
      ),
    );
  }
}