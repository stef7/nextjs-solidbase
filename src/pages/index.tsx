import Link from "next/link";
import styles from "~/styles/Home.module.css";
import { Page, PropsFn } from "~/types/next-simpler";

export const getStaticProps: PropsFn<{
  testProp: string;
}> = async () => {
  return {
    props: {
      testProp: "Hello!",
    },
  };
};

const HomePage: Page<typeof getStaticProps> = ({ testProp }) => {
  return (
    <>
      <h1 className={styles.element1}>Home - {testProp}</h1>
      <p>
        <Link href="/about">About</Link>
      </p>
    </>
  );
};

export default HomePage;
