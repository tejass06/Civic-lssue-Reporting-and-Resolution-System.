// src/theme.js

import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#62A9FF', // A bright blue for accents and buttons
    },
    secondary: {
      main: '#441d2aff', // A light pink for secondary elements
    },
    background: {
      default: '#252020ff', // The core dark background
      paper: '#352f2fff', // Darker background for cards and surfaces
    },
    text: {
      primary: '#bab8b6ff',
      secondary: '#978e8eff',
    },
  },
  typography: {
    fontFamily: ['"Roboto"', '"Helvetica"', 'Arial', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1E1E1E',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiSelect: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            }
        }
    }
  },
});

export default darkTheme;