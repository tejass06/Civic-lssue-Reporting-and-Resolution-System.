import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:location/location.dart';
import 'package:latlong2/latlong.dart';

import 'http_overrides.dart';
import 'models/report.dart';
import 'services/api_service.dart';
import 'screens/new_report_screen.dart';
import 'screens/view_reports_screen.dart';
import 'screens/report_detail_screen.dart';

void main() {
  HttpOverrides.global = MyHttpOverrides();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'PragatiSetu',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF121212),
        primaryColor: const Color(0xFF1F1F1F),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF1F1F1F),
          secondary: Color(0xFF62A9FF),
          surface: Color(0xFF1E1E1E),
          background: Color(0xFF121212),
          onPrimary: Colors.white,
          onSecondary: Colors.black,
          onSurface: Colors.white,
          onBackground: Colors.white,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1F1F1F),
          elevation: 4,
          titleTextStyle: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFF1E1E1E),
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: Color(0xFF62A9FF),
          foregroundColor: Colors.black,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF62A9FF),
            foregroundColor: Colors.black,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        textTheme: TextTheme(
          titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white.withOpacity(0.9)),
          titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.9)),
          bodyLarge: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.8)),
          bodyMedium: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.6)),
        ),
        listTileTheme: const ListTileThemeData(
          iconColor: Color(0xFF62A9FF),
        ),
        dividerTheme: DividerThemeData(
          color: Colors.white.withOpacity(0.1),
          thickness: 1,
        ),
      ),
      home: const MapScreen(),
    );
  }
}

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  LocationData? _currentLocation;
  late Future<List<Report>> _reportsFuture;
  final ApiService _apiService = ApiService();
  String? _error;

  @override
  void initState() {
    super.initState();
    _reportsFuture = _apiService.fetchReports();
    _getLocation();
  }

  void _refreshReports() {
    setState(() {
      _reportsFuture = _apiService.fetchReports();
    });
  }

  Future<void> _getLocation() async {
    await Future.delayed(const Duration(milliseconds: 500)); 

    Location location = Location();
    bool serviceEnabled;
    PermissionStatus permissionGranted;

    serviceEnabled = await location.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await location.requestService();
      if (!serviceEnabled) {
        if (mounted) {
          setState(() => _error = "Location services are disabled.");
        }
        return;
      }
    }

    permissionGranted = await location.hasPermission();
    if (permissionGranted == PermissionStatus.denied) {
      permissionGranted = await location.requestPermission();
      if (permissionGranted != PermissionStatus.granted) {
        if (mounted) {
          setState(() => _error = "Location permissions are denied.");
        }
        return;
      }
    }

    try {
      final locationData = await location.getLocation();
      if (mounted) {
        setState(() {
          _currentLocation = locationData;
          if (locationData.latitude != null && locationData.longitude != null) {
            _mapController.move(LatLng(locationData.latitude!, locationData.longitude!), 16.0);
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _error = "Could not get your location.");
      }
    }
  }

  // --- NEW: Helper method to create markers for all reports ---
  List<Marker> _createReportMarkers(List<Report> reports) {
    return reports.where((report) => report.latitude != null && report.longitude != null)
      .map((report) => Marker(
        point: LatLng(report.latitude!, report.longitude!),
        width: 80,
        height: 80,
        child: Icon(report.icon, size: 40, color: Colors.redAccent),
      ))
      .toList();
  }

  @override
  Widget build(BuildContext context) {
    const puneCenter = LatLng(18.5204, 73.8567);

    return Scaffold(
      appBar: AppBar(
        title: const Text('PragatiSetu'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshReports,
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(color: Theme.of(context).colorScheme.primary),
              child: Text('Menu', style: Theme.of(context).textTheme.titleLarge),
            ),
            ListTile(
              leading: const Icon(Icons.add_location_alt_rounded),
              title: const Text('New Report'),
              onTap: () async {
                Navigator.pop(context);
                final result = await Navigator.push(context, MaterialPageRoute(builder: (context) => const NewReportScreen()));
                if (result == true && mounted) {
                  _refreshReports();
                }
              },
            ),
            ListTile(
              leading: const Icon(Icons.view_list_rounded),
              title: const Text('View All Reports'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (context) => const ViewReportsScreen()));
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_rounded),
              title: const Text('My Profile'),
              onTap: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            flex: 1,
            child: FutureBuilder<List<Report>>(
              future: _reportsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return const Center(child: Text('Could not load reports.'));
                } else if (snapshot.hasData) {
                  final reports = snapshot.data!;
                  final reportMarkers = _createReportMarkers(reports);

                  return FlutterMap(
                    mapController: _mapController,
                    options: const MapOptions(
                      initialCenter: puneCenter,
                      initialZoom: 14.0,
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        userAgentPackageName: 'com.example.pragatisetu',
                      ),
                      MarkerLayer(
                        markers: [
                          if (_currentLocation != null)
                            Marker(
                              point: LatLng(_currentLocation!.latitude!, _currentLocation!.longitude!),
                              width: 80,
                              height: 80,
                              child: Icon(Icons.location_pin, size: 50, color: Theme.of(context).colorScheme.secondary),
                            ),
                          // --- NEW: Add the markers for all reports ---
                          ...reportMarkers,
                        ],
                      ),
                    ],
                  );
                }
                return const Center(child: Text('No reports found.'));
              },
            ),
          ),
          const Divider(height: 1),
          Expanded(
            flex: 1,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text('Recent Reports', style: Theme.of(context).textTheme.titleLarge),
                ),
                Expanded(
                  child: FutureBuilder<List<Report>>(
                    future: _reportsFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      } else if (snapshot.hasError) {
                        return const Center(child: Text('Could not load reports.'));
                      } else if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                        final reports = snapshot.data!;
                        return ListView.builder(
                          itemCount: reports.length,
                          itemBuilder: (context, index) {
                            final report = reports[index];
                            return Card(
                              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
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
                ),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(context, MaterialPageRoute(builder: (context) => const NewReportScreen()));
          if (result == true && mounted) {
            _refreshReports();
          }
        },
        child: const Icon(Icons.add_rounded),
      ),
    );
  }
}