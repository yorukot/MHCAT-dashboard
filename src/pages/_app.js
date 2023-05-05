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
      // brand colors
      primary: '#14bdff',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',

      // you can also create your own color
      myColor: '#ff4ecd'

      // ...  more colors
    },
  },
});

const darkTheme = createMuiTheme({
  palette: {
    mode: "dark",
    background: {
      default: '#242426',
      paper:'#242426',
      dark: '#212121'
    },
    primary: {
      main: "#14bdff",
      dark: '#14bdff'
    },
    action: {
      focus: '#000000'
    },
    secondary: {
      main: "#f50057",
    },
    text: {
      primary: "#c7c7c7",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
   shape: {
    borderRadius: 10
   }
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
