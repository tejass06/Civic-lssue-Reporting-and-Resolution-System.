import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Sidebar from './Sidebar';
import { jwtDecode } from 'jwt-decode';

const MainLayout = () => {
  // Decode the token here to get user information
  const token = localStorage.getItem('token');
  let userDepartment = '';
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userDepartment = decodedToken.department;
    } catch (error) {
      console.error("Invalid token:", error);
      // Handle invalid token, maybe log out
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            PragatiSetu Portal
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      
      {/* Pass the user's department as a prop to the Sidebar */}
      <Sidebar userDepartment={userDepartment} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet /> {/* This is where your dashboard pages will be rendered */}
      </Box>
    </Box>
  );
};

export default MainLayout;