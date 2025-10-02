import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// UPDATED: Import the fetchReports function from your central service
import { fetchReports } from './apiService';

// Fix for a known issue with React-Leaflet and default icons
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});


const ReportsMap = ({ onReportSelect }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReports = async () => {
      try {
        // UPDATED: Use the fetchReports function from the apiService.
        // This will automatically include your security token.
        const response = await fetchReports(); 
        setReports(response.data);
      } catch (error) {
        console.error("Failed to fetch reports for the map:", error);
      } finally {
        setLoading(false);
      }
    };

    getReports();
  }, []); // The empty array ensures this runs only once

  if (loading) {
    return <div>Loading map...</div>;
  }

  const punePosition = [18.5204, 73.8567];

  return (
    <MapContainer center={punePosition} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {reports.map(report => (
        <Marker 
          key={report.id} 
          position={[report.latitude, report.longitude]}
          eventHandlers={{
            click: () => {
              onReportSelect(report); // Call the function passed from the parent dashboard
            },
          }}
        >
          <Popup>
            <strong>{report.type}</strong><br />
            {report.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ReportsMap;