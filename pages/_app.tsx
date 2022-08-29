import '../styles/globals.scss';
import 'normalize.css/normalize.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {appWithTranslation} from 'next-i18next';
import {initializeWizStore, StoreContext} from 'stores/WizStore';
import {ThemeProvider} from '@mui/material/styles';
import wizDefaultTheme from 'components/bui/theme';
import WizAppBar from 'components/appBar/WizAppBar';
import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';

function MyApp({Component, pageProps}: AppProps) {
  const store = initializeWizStore(pageProps.initialState);

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={wizDefaultTheme}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width"/>
        </Head>
        <WizAppBar />
        <Grid container display="flex" justifyContent="center" sx={{paddingTop: '1em', paddingBottom: '2em'}}>
          <Grid xs={11} md={8} xl={6}>
            <Component {...pageProps} />
          </Grid>
        </Grid>


      </ThemeProvider>

    </StoreContext.Provider>

  );
}

export default appWithTranslation(MyApp);

