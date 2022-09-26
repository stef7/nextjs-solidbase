import "~/styles/all.scss";
import NProgress from "nprogress";
import Router, { NextRouter } from "next/router";
import React, { createContext, useEffect, useMemo } from "react";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import type { App, ThisAppContext } from "~/types/next";
import { logError } from "~/utils/monitoring";

export const AppContext = createContext<ThisAppContext | null>(null);

const ThisApp: App = ({ Component: PageComponent, pageProps: pageProperties, router, ...appRest }) => {
  useEffect(() => {
    document.documentElement.classList[router.pathname === "/admin" ? "add" : "remove"]("cms");
  }, [router.pathname]);

  const PageLayout = useMemo(() => PageComponent.layout ?? DefaultLayout, [PageComponent.layout]);

  return (
    <AppContext.Provider value={{ PageComponent, pageProperties, router, ...appRest }}>
      <PageLayout>
        <PageComponent {...pageProperties} />
      </PageLayout>
    </AppContext.Provider>
  );
};
export default ThisApp;

Router.events.on("routeChangeStart", (_path: string, options: Parameters<NextRouter["push"]>[2]) => {
  if (!options?.shallow) NProgress.start();
});
Router.events.on("routeChangeComplete", (_path: string) => {
  NProgress.done();
});
Router.events.on("routeChangeError", (...args) => {
  NProgress.done();
  logError(`Route change error.`, ...args);
});
