// ref: https://nystudio107.com/blog/speeding-up-tailwind-css-builds
import "~/styles/global.css";

import { useMemo } from "react";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { NextApp } from "~/types/next-simpler";

const App: NextApp = (appProperties) => {
  const { Component: PageComponent, pageProps } = appProperties;
  const PageLayout = useMemo(() => PageComponent.layout ?? DefaultLayout, [PageComponent.layout]);

  return (
    <PageLayout {...appProperties}>
      <PageComponent {...pageProps} />
    </PageLayout>
  );
};

export default App;
