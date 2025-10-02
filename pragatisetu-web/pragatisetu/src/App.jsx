import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from './theme';
import { jwtDecode } from 'jwt-decode';

import MainLayout from './MainLayout';
import Dashboard from './Dashboard';
import SignIn from './SignIn';
import UserManagement from './UserManagement'; // Import the new page


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const DepartmentRedirect = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decodedToken = jwtDecode(token);
    const department = decodedToken.department.toLowerCase();

    if (department === 'road') return <Navigate to="/road" replace />;
    if (department === 'garbage') return <Navigate to="/garbage" replace />;
    if (department === 'water') return <Navigate to="/water" replace />;
    
    return <Navigate to="/all" replace />;
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DepartmentRedirect />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="all" element={<Dashboard key="all" issueTypes={[]} />} />
            <Route path="road" element={<Dashboard key="road" issueTypes={['Pothole']} />} />
            <Route path="garbage" element={<Dashboard key="garbage" issueTypes={['Garbage Overflow']} />} />
            <Route path="water" element={<Dashboard key="water" issueTypes={['Water Leakage']} />} />
          
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;