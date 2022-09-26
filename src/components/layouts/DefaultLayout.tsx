import Head from "next/head";
import { Layout } from "~/types/next";
import { Container } from "~/components/organisms/Container";
import styles from "./DefaultLayout.module.scss";
import { pagesPath } from "~/utils/$path";
import Link from "next/link";
import clsx from "clsx";
import { useCallback, useContext } from "react";
import { AppContext } from "~/pages/_app";

const DefaultLayout: Layout = ({ children }) => {
  const { router } = useContext(AppContext) ?? {};
  const activeClass = useCallback(
    (pathname: string) => clsx([router?.pathname, router?.asPath].includes(pathname) && "font-extrabold") || undefined,
    [router],
  );
  return (
    <>
      <Head>
        <title>Title</title>
      </Head>

      <header className={styles.header}>
        <Container>
          <div className={styles.logo}>Site Name</div>

          <nav className={styles.skipLinks}>
            <ul>
              <li>
                <a href="#main">Skip to main content</a>
              </li>
              <li>
                <a href="#footer">Skip to footer</a>
              </li>
            </ul>
          </nav>

          <nav className={styles.navMain}>
            <ul>
              <li>
                <Link href={pagesPath.$url()}>
                  <a className={activeClass("/")}>Home</a>
                </Link>
              </li>
              <li>
                <Link href={pagesPath._slug("about").$url()}>
                  <a className={activeClass("/about")}>About</a>
                </Link>
              </li>
              <li>
                <Link href={pagesPath.news.$url()}>
                  <a className={activeClass("/news")}>News</a>
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </header>

      <main id="main" className={styles.main}>
        {children}
      </main>

      <footer id="footer" className={styles.footer}>
        <Container>
          <nav>
            <ul>
              <li>
                <Link href={pagesPath._slug("privacy").$url()}>Privacy Policy</Link>
              </li>
            </ul>
          </nav>
        </Container>
      </footer>
    </>
  );
};
export default DefaultLayout;
