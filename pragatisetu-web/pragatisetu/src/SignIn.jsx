// src/SignIn.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Container, Alert, Paper, Avatar, Divider, Link as MuiLink } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#62A9FF',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: '#62A9FF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#62A9FF',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
  },
});

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5057/api/Auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper 
            elevation={8}
            sx={{
              padding: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              PragatiSetu Portal
            </Typography>
            <Typography component="p" color="text.secondary" sx={{ mt: 1 }}>
              Sign in to manage departmental issues
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SignIn;