import '../styles/globals.scss';
import 'normalize.css/normalize.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {appWithTranslation} from 'next-i18next';
import {initializeBasStore, StoreContext} from 'stores/AppStore';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

function MyApp({Component, pageProps}: AppProps) {
  const store = initializeBasStore(pageProps.initialState);
  const queryClient = new QueryClient();

  return (
    <StoreContext.Provider value={store}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </StoreContext.Provider>

  );
}

export default appWithTranslation(MyApp);
