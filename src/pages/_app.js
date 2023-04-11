import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import AppHeaderBar from "../layouts/AppHeaderBar";
import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { SSRProvider } from "@react-aria/ssr";
import { useSSR } from "@nextui-org/react";
import { createTheme, NextUIProvider, Text } from "@nextui-org/react";
import { ThemeProvider, createMuiTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// 2. Call `createTheme` and pass your custom values
const myDarkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      background: "#1d1d1d",
    },
    space: {},
    fonts: {},
  },
});

const darkTheme = createMuiTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    text: {
      primary: "#d0d0d0",
    },
    divider: "#979797",
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { isBrowser } = useSSR();
  return (
    isBrowser && (
      <SSRProvider>
        <ThemeProvider theme={darkTheme}>
          <NextUIProvider theme={myDarkTheme}>
            <Head>
              <title>MHCAT</title>
            </Head>
            <SessionProvider session={session}>
              <div>
                Hello World!
                <style global jsx>{`
                  html,
                  body,
                  body > div:first-child,
                  div#__next,
                  div#__next > div {
                    height: 100%;
                  }
                `}</style>
                <AppHeaderBar>
                  <Component {...pageProps}></Component>
                </AppHeaderBar>
              </div>
            </SessionProvider>
          </NextUIProvider>
        </ThemeProvider>
      </SSRProvider>
    )
  );
}
