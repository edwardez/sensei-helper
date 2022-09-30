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
          <link rel="icon" type="image/x-icon" href="/favicon.png"/>
          <link rel="apple-touch-icon" href="/icons/apple-180x180.png"/>
          <link rel="manifest" href="/manifest.json"/>
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2732-2048.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1668-2388.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2388-1668.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1536-2048.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2048-1536.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1668-2224.jpg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2224-1668.jpg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1620-2160.jpg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2160-1620.jpg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1284-2778.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2778-1284.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1170-2532.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2532-1170.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2436-1125.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1242-2688.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2688-1242.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-828-1792.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1792-828.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1242-2208.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-2208-1242.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-750-1334.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1334-750.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-640-1136.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
          <link rel="apple-touch-startup-image" href="/icons/apple-splash/apple-splash-1136-640.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
          <meta name="description" content="Sensei helper is a Blue Archive equipment farming calculator, tell it equipments you need/your pieces inventory and it will suggest how to farm in normal campaign" key="meta.description"/>
          <meta charSet="utf-8"/>

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
    )
    ;
  }
}

export default MyDocument;
