import {ThemeProvider} from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import 'styles/globals.scss';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {appWithTranslation} from 'next-i18next';
import {initializeWizStore, isWizStore, StoreContext} from 'stores/WizStore';
import wizDefaultTheme from 'components/bui/theme';
import WizAppBar from 'components/appBar/WizAppBar';
import React, {useEffect, useState} from 'react';
import {applySnapshot, onSnapshot} from 'mobx-state-tree';
import {getFromLocalStorage, setToLocalStorage} from 'common/LocalStorageUtil';


function MyApp({Component, pageProps}: AppProps) {
  const [isStoreInitialized, setIsStoreInitialized] = useState(false);
  const store = initializeWizStore(pageProps.initialState);
  useEffect(() => {
    const persistedSnapshot = getFromLocalStorage('wishlistapp');

    if (persistedSnapshot) {
      const json = JSON.parse(persistedSnapshot);
      try {
        if (isWizStore(json)) {
          applySnapshot(store, json);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setIsStoreInitialized(true);
  }, [isStoreInitialized]);
  useEffect(() => {
    const dispose = onSnapshot(store, (newSnapshot) => {
      setToLocalStorage('wishlistapp', JSON.stringify(newSnapshot));
    });

    return () => dispose();
  }, []);
  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={wizDefaultTheme}>
        <CssBaseline />
        <Head>
          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
          />
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

