import {ThemeProvider} from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
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
import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from 'common/LocalStorageUtil';
import RestoreDataExceptionDialog from 'components/settings/dataManagement/RestoreDataExceptionDialog';
import {initializeAnalytics} from 'common/gtag';


function MyApp({Component, pageProps}: AppProps) {
  const [isStoreInitialized, setIsStoreInitialized] = useState(false);
  const [isExceptionDialogOpened, setIsExceptionDialogOpened] = useState(false);
  const [corruptedData, setCorruptedData] = useState('');

  const store = initializeWizStore(/* pageProps.initialState */);
  useEffect(() => {
    const persistedSnapshot = getFromLocalStorage(wizStorageLocalStorageKey);

    if (persistedSnapshot) {
      let json;
      try {
        json = JSON.parse(persistedSnapshot);
        applySnapshot(store, json);
      } catch (e) {
        const hasEnteredPlentyInventoryData = Object.values(json?.equipmentsRequirementStore?.piecesInventory ?? {}).length >= 10;
        const hasEnteredPlentyEquipmentData = json?.equipmentsRequirementStore?.requirementByEquipments?.length >= 5;
        const hasEnteredPlentyPiecesData = json?.equipmentsRequirementStore?.requirementByPieces?.length >= 10;

        // Notify reset to back up corrupted data if they have entered a lot.
        if (hasEnteredPlentyInventoryData || hasEnteredPlentyEquipmentData || hasEnteredPlentyPiecesData) {
          setIsExceptionDialogOpened(true);
        } else {
          handleDataReset();
        }

        const exceptionStorage = {
          exception: String(e),
          [wizStorageLocalStorageKey]: json ?? persistedSnapshot,
        };
        setToLocalStorage(wizExceptionStorageLocalStorageKey,
            JSON.stringify(exceptionStorage)
        );

        setCorruptedData(persistedSnapshot);
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

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={wizDefaultTheme}>
        <>
          {
            isExceptionDialogOpened? <RestoreDataExceptionDialog isOpened={isExceptionDialogOpened}
              corruptedData={corruptedData}
              handleDataReset={handleDataReset} /> :
                null
          }
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
          <Grid size={{xs: 11, md: 8, xl: 6}}>
            <Component {...pageProps} />
          </Grid>
        </Grid>


      </ThemeProvider>

    </StoreContext.Provider>

  );
}

export default appWithTranslation(MyApp);
