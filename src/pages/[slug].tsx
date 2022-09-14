import Link from "next/link";
import { Page, PathsFn, PropsFn } from "~/types/next-simpler";

export const getStaticPaths: PathsFn<{ slug: string }> = async () => {
  return {
    paths: [{ params: { slug: "about" } }],
    fallback: "blocking",
  };
};

export const getStaticProps: PropsFn<{ _slug: string | undefined }, typeof getStaticPaths> = async ({ params }) => {
  return {
    props: { _slug: params?.slug },
  };
};

const SlugPage: Page<typeof getStaticProps> = ({ _slug }) => {
  return (
    <>
      <h1>Slug: {_slug}</h1>
      <p>
        <Link href="/">Home</Link>
      </p>
      <style jsx>{`
        h1 {
          color: #8800ffcc;
        }
        :global(body) {
          background: #ddddff66;
        }
      `}</style>
    </>
  );
};

export default SlugPage;
