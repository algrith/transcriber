import Document, { Html, Head, Main, NextScript } from 'next/document';

const AppDocument = () => {
  return (
    <Html lang="en-US">
      <Head>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

        <meta property="og:keywords" name="keywords" content="Algrith Speech to Text, Audio Transcriber" />
        <meta property="og:image" name="image" content="/images/logo/algrith-transparent.png" />
        <meta property="og:description" name="description" content="Algrith Speech Transcriber" />
        <meta property="og:author" name="author" content="Algrith" />
        <meta name="description" content="Algrith Speech Transcriber" />
        
        <link rel="icon" type="image/png" sizes="512x512" href="/images/favicon/android-chrome-512x512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon/android-chrome-192x192.png" />
        <link rel="apple-touch-icon" type="image/png" href="/images/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png" />
        <link rel="shortcut icon" type="image/png" href="/images/favicon/favicon.ico" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffffff" />
        <link rel="manifest" href="/app.webmanifest" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

AppDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);
  return { ...initialProps };
};

export default AppDocument;