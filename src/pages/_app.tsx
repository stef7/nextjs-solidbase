import "~/styles/globals.css";
import { NextApp } from "~/types/next-simpler";

const App: NextApp = ({ Component: PageComponent, pageProps }) => {
  return <PageComponent {...pageProps} />;
};

export default App;
