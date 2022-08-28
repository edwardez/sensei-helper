// pages/_document.js

import Document, {Head, Html, Main, NextScript} from 'next/document';
import Script from 'next/script';
import React from 'react';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <body>
          <Main/>
          <NextScript/>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-N7EGVX542B"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-N7EGVX542B');
        `}
          </Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
