// ref: https://nystudio107.com/blog/speeding-up-tailwind-css-builds
import "~/styles/global.css";

import { useMemo } from "react";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { NextApp } from "~/types/next-simpler";

const App: NextApp = ({ Component: PageComponent, pageProps }) => {
  const PageLayout = useMemo(() => PageComponent.layout ?? DefaultLayout, [PageComponent.layout]);

  return (
    <PageLayout {...{ PageComponent, pageProps }}>
      <PageComponent {...pageProps} />
    </PageLayout>
  );
};

export default App;
