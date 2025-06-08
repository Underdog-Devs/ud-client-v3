import { createTheme } from '@mui/material/styles';

// UnderdogDevs brand colors (from app/styles/variables.scss)
const brandColors = {
  primary: {
    main: '#f05138', // udOrange - primary brand color
    light: '#f6931d', // udSecondaryOrange
    dark: '#d63916',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#58555a', // udDarkGrey
    light: '#e4e3e3', // udGrey
    dark: '#23211e', // udBlack
    contrastText: '#ffffff',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
};

// Create the MUI theme
export const theme = createTheme({
  palette: {
    mode: 'light',
    ...brandColors,
    background: {
      default: '#fff9f4', // udBackground
      paper: '#ffffff',
    },
    text: {
      primary: '#183b56', // textBlack
      secondary: '#5a7184', // subTextBlack
    },
  },
  typography: {
    fontFamily: [
      '"Source Sans Pro"', // primaryTextFont
      '"Open Sans"', // linkFont  
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '4rem', // f1
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: '"Raleway", sans-serif', // primaryHeaderFont
    },
    h2: {
      fontSize: '3rem', // f2
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: '"Raleway", sans-serif',
    },
    h3: {
      fontSize: '2rem', // f3
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Raleway", sans-serif',
    },
    h4: {
      fontSize: '1.5rem', // f4
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: '"Josefin Sans", sans-serif', // secondaryHeaderFont
    },
    h5: {
      fontSize: '1rem', // f5
      fontWeight: 500,
      lineHeight: 1.5,
      fontFamily: '"Josefin Sans", sans-serif',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
      fontFamily: '"Josefin Sans", sans-serif',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
        },
        containedPrimary: {
          backgroundColor: brandColors.primary.main,
          '&:hover': {
            backgroundColor: brandColors.primary.dark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary.main,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: brandColors.primary.light + '20',
            '&:hover': {
              backgroundColor: brandColors.primary.light + '30',
            },
          },
        },
      },
    },
  },
});

export default theme;