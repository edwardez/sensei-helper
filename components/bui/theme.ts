import {createTheme} from '@mui/material/styles';
import variables from 'scss/variables.module.scss';

declare module '@mui/material/styles' {
  interface Palette {
    baButtonPrimary: Palette['primary'];
    baTextButtonPrimary: Palette['primary'];
    baButtonLightBackgroundPrimary: Palette['primary'];
    baButtonSecondary: Palette['secondary'];
  }
  interface PaletteOptions {
    baButtonPrimary: PaletteOptions['primary'];
    baTextButtonPrimary: PaletteOptions['primary'];
    baButtonLightBackgroundPrimary: PaletteOptions['primary'];
    baButtonSecondary: PaletteOptions['secondary'];
  }
}

declare module '@mui/material/Button' {
  export interface ButtonPropsColorOverrides {
    baButtonPrimary: true;
    baButtonSecondary: true;
    baButtonLightBackgroundPrimary: true;
    baTextButtonPrimary: true;
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
  },
  palette: {
    baButtonPrimary: {
      main: variables.baPrimaryButtonColor,
      contrastText: variables.baPrimaryButtonTextColor,
    },
    baButtonLightBackgroundPrimary: {
      main: variables.baLightButtonColor,
      contrastText: variables.baPrimaryButtonTextColor,
    },
    baTextButtonPrimary: {
      main: variables.baPrimaryButtonTextColor,
    },
    baButtonSecondary: {
      main: variables.baSecondaryButtonColor,
      contrastText: variables.baSecondaryButtonTextColor,
    },
  },
});


export default wizDefaultTheme;
