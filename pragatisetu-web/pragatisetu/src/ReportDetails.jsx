import React, { useState, useEffect } from 'react';
// NEW: Import map components
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, TextField } from '@mui/material';
import { updateIssueStatus, assignWorkerToIssue } from './apiService';

const ReportDetails = ({ report, onReportUpdate }) => {
  const [newStatus, setNewStatus] = useState(report.status);
  const [workerName, setWorkerName] = useState(report.assignedTo || '');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingAssign, setLoadingAssign] = useState(false);

  // When a new report is selected from the list, this updates the details view
  useEffect(() => {
    setNewStatus(report.status);
    setWorkerName(report.assignedTo || '');
  }, [report]);

  const handleUpdateStatus = async () => {
    setLoadingStatus(true);
    try {
      await updateIssueStatus(report.id, newStatus);
      onReportUpdate(report.id, { status: newStatus });
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status.');
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleAssignWorker = async () => {
    if (!workerName) {
      alert('Please enter a worker name.');
      return;
    }
    setLoadingAssign(true);
    try {
      await assignWorkerToIssue(report.id, workerName);
      onReportUpdate(report.id, { assignedTo: workerName, status: 'In Progress' });
      alert('Worker assigned successfully!');
    } catch (error) {
      console.error('Failed to assign worker:', error);
      alert('Failed to assign worker.');
    } finally {
      setLoadingAssign(false);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h5" gutterBottom>{report.type}</Typography>
      
      {/* --- NEW: Map for the specific location --- */}
      <Box sx={{ height: 200, width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer 
          center={[report.latitude, report.longitude]} 
          zoom={16} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false} // Optional: disable zoom on scroll
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[report.latitude, report.longitude]}>
            <Popup>{report.type}</Popup>
          </Marker>
        </MapContainer>
      </Box>

      <Typography variant="body1"><strong>Location:</strong> {report.location}</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}><strong>Status:</strong> {report.status}</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        <strong>Assigned To:</strong> {report.assignedTo || 'Unassigned'}
      </Typography>

      <img src={report.imageUrl} alt={report.type} style={{ width: '100%', marginTop: '16px', borderRadius: '8px' }} />
      <Typography variant="body1" sx={{ mt: 2 }}><strong>Description:</strong> {report.description}</Typography>

      <Box sx={{ mt: 4, borderTop: '1px solid grey', pt: 2 }}>
        <Typography variant="h6">Actions</Typography>
        
        {/* Update Status Form */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Update Status</InputLabel>
          <Select value={newStatus} label="Update Status" onChange={(e) => setNewStatus(e.target.value)}>
            <MenuItem value={"Pending"}>Pending</MenuItem>
            <MenuItem value={"In Progress"}>In Progress</MenuItem>
            <MenuItem value={"Solved"}>Solved</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleUpdateStatus} disabled={loadingStatus || newStatus === report.status} sx={{ mt: 1 }}>
          {loadingStatus ? <CircularProgress size={24} /> : 'Update Status'}
        </Button>

        {/* Assign Worker Form */}
        <TextField
          label="Assign to Worker"
          variant="outlined"
          fullWidth
          value={workerName}
          onChange={(e) => setWorkerName(e.target.value)}
          sx={{ mt: 3 }}
        />
        <Button variant="contained" onClick={handleAssignWorker} disabled={loadingAssign} sx={{ mt: 1 }}>
          {loadingAssign ? <CircularProgress size={24} /> : 'Assign Worker'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReportDetails;