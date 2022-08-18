import '../styles/globals.scss';
import 'normalize.css/normalize.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';

function MyApp({Component, pageProps}) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
