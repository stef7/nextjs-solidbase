import { getContent, getFolderPaths, CmsContent } from "~/cms/content-api";
import { Container } from "~/components/organisms/Container";
import { PageBuilderModules } from "~/components/wrappers/PageBuilderModules";
import { Page, PathsFn, PropsFn } from "~/types/next";

export const getStaticPaths: PathsFn<{ slug: string }> = async () => {
  return {
    paths: getFolderPaths("pages").slugs.map(([slug]) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: PropsFn<{ entry: CmsContent<"pages"> }, typeof getStaticPaths> = async ({ params }) => {
  const entry = getContent("pages", params?.slug);
  if (!entry) return { notFound: true };
  return {
    props: { entry },
  };
};

const PagesPage: Page<typeof getStaticProps> = ({ entry }) => {
  return (
    <>
      <Container>
        <h1 className="text-purple-600 text-opacity-50">{entry.title}</h1>
      </Container>
      <PageBuilderModules field={entry.PAGEBUILDER} />
    </>
  );
};

export default PagesPage;
