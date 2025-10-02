import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

import { fetchReports } from './apiService';
import ReportsMap from './ReportsMap';
import StatsCards from './StatsCards'; 
import ReportsList from './ReportsList';
import ReportDetails from './ReportDetails';

const Dashboard = ({ issueTypes }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const getReports = async () => {
      try {
        setLoading(true);
        const response = await fetchReports(issueTypes);
        setReports(response.data);
        setSelectedReport(null);
      } catch (err) {
        setError('Could not fetch reports from the API.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getReports();
  }, [issueTypes]);

  const handleReportSelect = (report) => setSelectedReport(report);

  const handleReportUpdate = (reportId, updatedData) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, ...updatedData } : r));
    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => ({ ...prev, ...updatedData }));
    }
  };
  
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <StatsCards />
      <Box sx={{ display: 'flex', gap: 2, mt: 2, height: 'calc(100vh - 220px)' }}>
        <Box sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ height: '50%', width: '100%' }}>
            <ReportsMap reports={reports} onReportSelect={handleReportSelect} />
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <ReportsList reports={reports} onReportSelect={handleReportSelect} />
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          {selectedReport ? (
            <ReportDetails report={selectedReport} onReportUpdate={handleReportUpdate} />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', border: '1px dashed grey', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">Select a report from the list or map</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;