import * as Sentry from "@sentry/remix";
import LogRocket from "logrocket";
import * as React from "react";
import { useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ClientStyleContext from "./src/ClientStyleContext";
import createEmotionCache from "./src/createEmotionCache";
import theme from "./src/theme";

LogRocket.init("xojxaz/owen-merry-flights");

Sentry.init({
  dsn: "https://9b482445c8ec7ae4cbaaba7074cc1aa0@o464638.ingest.us.sentry.io/4508480690061312",
  tracesSampleRate: 1,

  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});

interface ClientCacheProviderProps {
  children: React.ReactNode;
}
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = React.useState(createEmotionCache());

  const clientStyleContextValue = React.useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    []
  );

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

const hydrate = () => {
  React.startTransition(() => {
    ReactDOM.hydrateRoot(
      document,
      <>
        <ClientCacheProvider>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            {/* <CssBaseline /> */}
            <RemixBrowser />
          </ThemeProvider>
        </ClientCacheProvider>
      </>
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
