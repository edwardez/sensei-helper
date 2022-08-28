import {createTheme} from '@mui/material/styles';
import variables from 'scss/variables.module.scss';

declare module '@mui/material/styles' {
  interface Palette {
    baButtonPrimary: Palette['primary'];
    baButtonSecondary: Palette['secondary'];
  }
  interface PaletteOptions {
    baButtonPrimary: PaletteOptions['primary'];
    baButtonSecondary: PaletteOptions['secondary'];
  }
}

declare module '@mui/material/Button' {
  export interface ButtonPropsColorOverrides {
    baButtonPrimary: true;
    baButtonSecondary: true;
  }
}


const wizDefaultTheme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&.MuiAccordion-root:before': {
            display: 'none',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: variables.baPrimaryTextColor,
        },
      },
    },
  },
  palette: {
    baButtonPrimary: {
      main: variables.baPrimaryButtonColor,
      contrastText: variables.baPrimaryButtonTextColor,
    },
    baButtonSecondary: {
      main: variables.baSecondaryButtonColor,
      contrastText: variables.baSecondaryButtonTextColor,
    },
  },
});


export default wizDefaultTheme;
