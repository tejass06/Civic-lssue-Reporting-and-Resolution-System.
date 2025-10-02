import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Avatar,
  Grid,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// A refined and professional dark theme
const professionalDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#367CF7', // A strong, professional blue
    },
    background: {
      default: '#0A1929', // A deep navy blue
    },
    text: {
      primary: '#F0F0F0',
      secondary: '#B0B9C4',
    },
  },
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
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
              borderColor: '#367CF7',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#367CF7',
              boxShadow: '0 0 0 2px rgba(54, 124, 247, 0.3)', // Subtle glow on focus
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#367CF7',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 0',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px 0 rgba(54, 124, 247, 0.35)',
          },
        },
      },
    },
  },
});

// Subtle fade-in animation for elements
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedBox = styled(Box)`
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const LOGIN_API_URL = 'http://localhost:5057/api/Auth/login'; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(LOGIN_API_URL, { username, password });
      localStorage.setItem('token', response.data.token);
      
      navigate('/dashboard'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={professionalDarkTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        
        {/* 1. Branding Side (Now on the Left with Background Image) */}
        <Grid 
          item 
          xs={false} 
          sm={4} 
          md={7} 
          sx={{
            // ADDED: Background Image and properties
            backgroundImage: `linear-gradient(rgba(10, 25, 41, 0.7), rgba(10, 25, 41, 0.7)), url('https://i.imgur.com/your-generated-image-url.png')`, // Replace with your image URL
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 15,
          }}
        >
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              PragatiSetu
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Crowdsourced Civic lssue Reporting and Resolution System.
            </Typography>
          </Box>
        </Grid>
        
        {/* 2. Login Form (on the Right) */}
        <Grid item xs={12} sm={8} md={5} component={Box} display="flex" alignItems="center" justifyContent="center">
          <Container component="div" maxWidth="xs">
            <AnimatedBox
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h4" sx={{ mt: 2, mb: 1 }}>
                Admin Sign In
              </Typography>
              
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, width: '100%' }}>
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </Box>
            </AnimatedBox>
          </Container>
        </Grid>
        
      </Grid>
    </ThemeProvider>
  );
};

export default LoginPage;