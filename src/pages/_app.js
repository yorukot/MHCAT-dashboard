import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import AppHeaderBar from "../layouts/AppHeaderBar";
import React from "react";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: {session, ...pageProps},
}) {
  const router = useRouter();

  if (router.pathname.startsWith("/signin")) {
    return (
      <SessionProvider session={session}>
        <Component {...pageProps}></Component>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={session}>
      <AppHeaderBar>
        <Component {...pageProps} />
      </AppHeaderBar>
    </SessionProvider>
  );
}