import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        light: '#f6931d',
        main: '#f6931d',
        dark: '#f6931d',
        contrastText: '#fff',
      },
      secondary: {
        light: '#f6931d',
        main: '#f6931d',
        dark: '#f6931d',
        contrastText: '#000',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });

  export default theme;