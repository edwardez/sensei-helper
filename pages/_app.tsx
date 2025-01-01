import {ThemeProvider} from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import 'styles/globals.scss';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {appWithTranslation} from 'next-i18next';
import {
  initializeWizStore,
  StoreContext,
  wizExceptionStorageLocalStorageKey,
  wizStorageLocalStorageKey,
} from 'stores/WizStore';
import wizDefaultTheme from 'components/bui/theme';
import WizAppBar from 'components/appBar/WizAppBar';
import React, {useEffect, useState} from 'react';
import {applySnapshot, onSnapshot} from 'mobx-state-tree';
import {
  getFromLocalStorage, removeFromLocalStorage, setToLocalStorage,
} from 'common/LocalStorageUtil';
import RestoreDataExceptionDialog
  from 'components/settings/dataManagement/RestoreDataExceptionDialog';
import {initializeAnalytics} from 'common/gtag';
import {DataManagementDialog} from 'components/settings/dataManagement/DataManagementDialog';


// eslint-disable-next-line require-jsdoc
function MyApp({Component, pageProps}: AppProps) {
  const [isStoreInitialized, setIsStoreInitialized] = useState(false);
  const [isExceptionDialogOpened, setIsExceptionDialogOpened] = useState(false);
  const [isDataMangementDialogOpened, setDataManagementDialogOpened] = useState(false);
  const [corruptedData, setCorruptedData] = useState('');

  const store = initializeWizStore(pageProps.initialState);
  useEffect(() => {
    const persistedSnapshot = getFromLocalStorage(wizStorageLocalStorageKey);

    if (persistedSnapshot) {
      let json;
      try {
        json = JSON.parse(persistedSnapshot);
        applySnapshot(store, json);
      } catch (e) {
        setCorruptedData(persistedSnapshot);
        setIsExceptionDialogOpened(true);

        setToLocalStorage(wizExceptionStorageLocalStorageKey, JSON.stringify({
          exception: String(e),
          [wizStorageLocalStorageKey]: json ?? persistedSnapshot,
        }));
      }
    }
    setIsStoreInitialized(true);
  }, [isStoreInitialized]);
  useEffect(() => {
    initializeAnalytics();
    const dispose = onSnapshot(store, (newSnapshot) => {
      setToLocalStorage(wizStorageLocalStorageKey, JSON.stringify(newSnapshot));
    });

    return () => dispose();
  }, []);

  const handleDataReset = () => {
    setIsExceptionDialogOpened(false);
    removeFromLocalStorage(wizStorageLocalStorageKey);
  };
  const handleManageData = () => {
    setIsExceptionDialogOpened(false);
    setDataManagementDialogOpened(true);
  };

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={wizDefaultTheme}>
        <>
          {isExceptionDialogOpened && <RestoreDataExceptionDialog isOpened={isExceptionDialogOpened}
            corruptedData={corruptedData}
            handleDataReset={handleDataReset}
            handleManageData={handleManageData} />}
          {isDataMangementDialogOpened && <DataManagementDialog key={corruptedData}
            open={isDataMangementDialogOpened} mode='recovery'
            value={corruptedData}
            onResetData={() => {
              handleDataReset();
              setDataManagementDialogOpened(false);
            }}
            onSubmit={(snapshot) => {
              applySnapshot(store, snapshot);
              setDataManagementDialogOpened(false);
            }} />}
        </>

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

