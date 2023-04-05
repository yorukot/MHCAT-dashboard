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

  return (
    <SessionProvider session={session}>
      <AppHeaderBar>
        <Component {...pageProps}></Component>
      </AppHeaderBar>
    </SessionProvider>
  );
}