/* eslint-disable @next/next/no-title-in-document-head */
/* eslint-disable @next/next/inline-script-id */
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="shortcut icon"
          href="https://cdn.discordapp.com/attachments/991337796960784424/1093112059891286086/favicon.ico"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
