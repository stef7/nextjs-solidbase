import { CmsContent, getContent, getFolderPaths } from "~/cms/content-api";
import { Container } from "~/components/organisms/Container";
import { PageBuilderModules } from "~/components/wrappers/PageBuilderModules";
import { Page, PathsFn, PropsFn } from "~/types/next";

export const getStaticPaths: PathsFn<{ slug: string }> = async () => {
  return {
    paths: getFolderPaths("news").slugs.map(([slug]) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: PropsFn<{ entry: CmsContent<"news"> }, typeof getStaticPaths> = async ({ params }) => {
  const entry = getContent("news", params?.slug);
  if (!entry) return { notFound: true };
  return {
    props: { entry },
  };
};

const NewsItemPage: Page<typeof getStaticProps> = ({ entry }) => {
  return (
    <>
      <Container>
        <p>News &gt;</p>
        <h1>{entry.title}</h1>
      </Container>
    </>
  );
};

export default NewsItemPage;
