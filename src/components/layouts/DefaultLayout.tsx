import Head from "next/head";
import NProgress from "nprogress";
import Router, { NextRouter } from "next/router";
import { useState } from "react";
import { Layout } from "~/types/next-simpler";
import { Container } from "~organisms/Container";

const DefaultLayout: Layout = ({ children, PageComponent, pageProps }) => {
  const [value, setValue] = useState("input test - state in layout");
  return (
    <Container>
      <Head>
        <title>Title</title>
      </Head>
      {children}
      <pre>
        {PageComponent.name} {JSON.stringify(pageProps, undefined, 2)}
      </pre>
      <input type="text" value={value} onChange={(event) => setValue(event.target.value)} />
    </Container>
  );
};
export default DefaultLayout;

Router.events.on("routeChangeStart", (_path: string, options: Parameters<NextRouter["push"]>[2]) => {
  if (!options?.shallow) NProgress.start();
});
Router.events.on("routeChangeComplete", (_path: string) => {
  NProgress.done();
});
Router.events.on("routeChangeError", (...arguments_) => {
  NProgress.done();
  console.error(`Route change error.`, ...arguments_);
});
