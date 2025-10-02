import React, { useState, useEffect } from 'react';
import { fetchStats } from './apiService'; // Import the new service function

const cardStyle = {
  backgroundColor: '#1E1E1E',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  flex: 1,
  margin: '0 10px',
};

const valueStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#62A9FF',
};

const labelStyle = {
  fontSize: '1rem',
  color: 'rgba(255, 255, 255, 0.7)',
};

function StatsCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await fetchStats(); // Use the service
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Set to default 0s on error
        setStats({ totalIssues: 0, solvedIssues: 0, pendingIssues: 0 });
      }
    };
    getStats();
  }, []);

  if (!stats) {
    return <div>Loading stats...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
      <div style={cardStyle}>
        <div style={valueStyle}>{stats.totalIssues}</div>
        <div style={labelStyle}>Total Issues</div>
      </div>
      <div style={cardStyle}>
        <div style={valueStyle}>{stats.solvedIssues}</div>
        <div style={labelStyle}>Solved</div>
      </div>
      <div style={cardStyle}>
        <div style={valueStyle}>{stats.pendingIssues}</div>
        <div style={labelStyle}>In Progress</div>
      </div>
    </div>
  );
}

export default StatsCards;