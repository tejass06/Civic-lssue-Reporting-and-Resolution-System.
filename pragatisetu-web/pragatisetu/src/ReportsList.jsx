// src/ReportsList.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  FormControl, 
  Select, 
  MenuItem, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions 
} from '@mui/material';
import { updateIssueStatus } from './apiService';

const ReportsList = ({ reports, onReportSelect, onStatusUpdate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogStatus, setDialogStatus] = useState('');

  const handleStatusChange = async (id, newStatus) => {
    try {
      const API_URL = `http://localhost:5057/api/Issues/${id}/status`;
      await axios.put(API_URL, { status: newStatus });
      console.log(`Report ${id} status updated to ${newStatus}`);
      onStatusUpdate(id, newStatus); 
    } catch (err) {
      console.error('Failed to update report status:', err);
    }
  };

  const handleEditClick = (report) => {
    setSelectedReport(report);
    setDialogStatus(report.status);
    setOpenDialog(true);
  };

  const handleDialogSave = () => {
    if (selectedReport && dialogStatus !== selectedReport.status) {
      handleStatusChange(selectedReport.id, dialogStatus);
    }
    setOpenDialog(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  if (reports.length === 0) {
    return <Typography>No reports found.</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', '&:hover': { backgroundColor: '#4e4646ff' } }}
                onClick={() => onReportSelect(report)} 
              >
                <TableCell component="th" scope="row">{report.type}</TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>
                 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Update Report Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{mb: 2}}>
            Report: {selectedReport?.type} at {selectedReport?.location}
          </Typography>
          <FormControl fullWidth>
            <Select
              value={dialogStatus}
              onChange={(e) => setDialogStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Working">Working</MenuItem>
              <MenuItem value="Solved">Solved</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportsList;