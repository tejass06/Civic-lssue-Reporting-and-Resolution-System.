// lib/screens/new_report_screen.dart

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:location/location.dart';
import '../models/report.dart';
import '../services/api_service.dart';

class NewReportScreen extends StatefulWidget {
  const NewReportScreen({super.key});

  @override
  State<NewReportScreen> createState() => _NewReportScreenState();
}

class _NewReportScreenState extends State<NewReportScreen> {
  final ApiService _apiService = ApiService();
  final _formKey = GlobalKey<FormState>();

  String? _selectedType;
  String _description = '';
  File? _imageFile;
  LocationData? _currentLocation;
  String _locationText = "Fetching location...";
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _getLocation();
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

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (context) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: const Icon(Icons.camera_alt),
            title: const Text('Take a photo'),
            onTap: () => Navigator.of(context).pop(ImageSource.camera),
          ),
          ListTile(
            leading: const Icon(Icons.photo_library),
            title: const Text('Choose from gallery'),
            onTap: () => Navigator.of(context).pop(ImageSource.gallery),
          ),
        ],
      ),
    );

    if (source != null) {
      final pickedFile = await picker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() => _imageFile = File(pickedFile.path));
      }
    }
  }

  Future<void> _getLocation() async {
    Location location = Location();
    bool serviceEnabled;
    PermissionStatus permissionGranted;

    try {
      // Check if location service is enabled
      serviceEnabled = await location.serviceEnabled();
      if (!serviceEnabled) {
        serviceEnabled = await location.requestService();
        if (!serviceEnabled) {
          setState(() {
            _locationText = "Location services disabled.";
          });
          return;
        }
      }

      // Check for location permissions
      permissionGranted = await location.hasPermission();
      if (permissionGranted == PermissionStatus.denied) {
        permissionGranted = await location.requestPermission();
        if (permissionGranted != PermissionStatus.granted) {
          setState(() {
            _locationText = "Location permissions denied.";
          });
          return;
        }
      }

      final locationData = await location.getLocation();
      setState(() {
        _currentLocation = locationData;
        _locationText = "Location obtained.";
      });
    } catch (e) {
      setState(() {
        _locationText = "Could not get location.";
      });
    }
  }

  Future<void> _submitReport() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      
      setState(() {
        _isLoading = true;
      });

      try {
        String? imageUrl;
        if (_imageFile != null) {
          imageUrl = await _apiService.uploadImage(_imageFile!);
        }

        final newReport = Report(
          type: _selectedType!,
          location: "Pune, India", 
          description: _description,
          imageUrl: imageUrl ?? '',
          status: 'Pending',
          latitude: _currentLocation?.latitude,
          longitude: _currentLocation?.longitude,
          createdAt: DateTime.now(),
          icon: _getIconForReportType(_selectedType!),
        );

        await _apiService.createReport(newReport);
        Navigator.pop(context, true);
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit report: $e')),
        );
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('File a New Report')),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                GestureDetector(
                  onTap: _pickImage,
                  child: Card(
                    color: Theme.of(context).colorScheme.surface,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 4,
                    child: Container(
                      height: 200,
                      alignment: Alignment.center,
                      child: _imageFile != null
                          ? Image.file(_imageFile!, fit: BoxFit.cover)
                          : Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.camera_alt, size: 50, color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6)),
                                const SizedBox(height: 8),
                                Text('Tap to add a photo', style: Theme.of(context).textTheme.bodyLarge),
                              ],
                            ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Card(
                  color: Theme.of(context).colorScheme.surface,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: DropdownButtonFormField<String>(
                      value: _selectedType,
                      decoration: const InputDecoration(labelText: 'Report Type', border: InputBorder.none),
                      items: <String>['Pothole', 'Garbage Overflow', 'Water Leakage']
                          .map((String value) {
                        return DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          _selectedType = newValue;
                        });
                      },
                      validator: (value) => value == null ? 'Please select an issue type' : null,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  color: Theme.of(context).colorScheme.surface,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Icon(Icons.location_on, color: Theme.of(context).colorScheme.secondary),
                        const SizedBox(width: 10),
                        Text(_locationText, style: Theme.of(context).textTheme.bodyLarge),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  color: Theme.of(context).colorScheme.surface,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: TextFormField(
                      decoration: const InputDecoration(labelText: 'Issue Description', border: InputBorder.none),
                      onSaved: (value) => _description = value!,
                      validator: (value) => value!.isEmpty ? 'Please enter a description' : null,
                      maxLines: 4,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : ElevatedButton(
                        onPressed: _submitReport,
                        child: const Text('Submit Report'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}