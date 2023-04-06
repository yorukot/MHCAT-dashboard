import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import AppHeaderBar from "../layouts/AppHeaderBar";
import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { SSRProvider } from "@react-aria/ssr";
import { useSSR } from "@nextui-org/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { isBrowser } = useSSR();
  return (
    isBrowser && (
      <SSRProvider>
        <>
          <Head>
            <title>MHCAT</title>
          </Head>
          <SessionProvider session={session}>
            <AppHeaderBar>
              <Component {...pageProps}></Component>
            </AppHeaderBar>
          </SessionProvider>
        </>
      </SSRProvider>
    )
  );
}
