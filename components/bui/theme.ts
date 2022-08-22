import {createTheme} from '@mui/material/styles';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    bas: true;
  }
}

const muibasDefaultTheme = createTheme();


const basDefaultTheme = createTheme({
  components: {
    MuiPaper: {
      variants: [
        {
          props: {variant: 'bas'},
          style: {
            transform: 'skewX(-10deg);',
          },
        },
      ],
    },
  },
});


export default basDefaultTheme;
