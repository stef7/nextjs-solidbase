import Document, { DocumentContext, Html, Head, Main, NextScript } from "next/document";

class AppDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    const initialProperties = await Document.getInitialProps(context);
    return { ...initialProperties };
  }

  render() {
    return (
      <Html lang="en-AU">
        <Head>
          {/* to be removed at go-live: */}
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
