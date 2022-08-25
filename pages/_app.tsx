import '../styles/globals.scss';
import 'normalize.css/normalize.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {appWithTranslation} from 'next-i18next';
import {initializeWizStore, StoreContext} from 'stores/WizStore';
import {ThemeProvider} from '@mui/material/styles';
import wizDefaultTheme from 'components/bui/theme';

function MyApp({Component, pageProps}: AppProps) {
  const store = initializeWizStore(pageProps.initialState);

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={wizDefaultTheme}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width"/>
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>

    </StoreContext.Provider>

  );
}

export default appWithTranslation(MyApp);
