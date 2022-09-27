import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-color-mode="dark" style={{colorScheme: "dark"}}>
        <Head>
        <meta name="description" content="Amanullah Nirob Chat application" />
                <meta name="keywords" content="amanullah nirob, chat, programmer, best hafej,best programmer" />
                <link rel="shortcut icon" href={'/static/images/favi.png'} />
                <link rel="icon" href={'/static/images/favi.png'} sizes="32x32" />
                <link rel="icon" href={'/static/images/favi.png'} sizes="192x192" />
                <link rel="apple-touch-icon-precomposed" href={'/static/images/favi.png'} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
