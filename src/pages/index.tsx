import { CmsContent, getContent } from "~/cms/content-api";
import { PageBuilderModules } from "~/components/wrappers/PageBuilderModules";
import { useContentRelations } from "~/cms/content-relations";
import { easyMap } from "~/utils/easy-rendering";
import { Page, PropsFn } from "~/types/next";
import { FaHeart } from "react-icons/fa";
import { Container } from "~/components/organisms/Container";
import SvgLogo from "~public/assets/svgLogo.svg";
import React from "react";

export const getStaticProps: PropsFn<{
  entry: CmsContent<"home">;
}> = async () => {
  const entry = getContent("home");
  if (!entry) return { notFound: true };
  return {
    props: {
      entry: entry,
    },
  };
};

const HomePage: Page<typeof getStaticProps> = ({ entry }) => {
  const newsItems = useContentRelations<"news">(entry.newsItems);
  const [pageRelation] = useContentRelations<"pages">([entry.pageRelation]);
  console.log({ SvgLogo });
  return (
    <>
      <Container>
        <h1 className="flex gap-3">
          Hey <FaHeart />
          <SvgLogo width="4rem" />
        </h1>

        {easyMap(
          newsItems,
          (newsItem, key) => (
            <li key={key}>{newsItem.content.title}</li>
          ),
          (children) => (
            <>
              <h2>News</h2>
              <ul>{children}</ul>
            </>
          ),
        )}
        {pageRelation && (
          <>
            <h2>Page</h2>
            <p>{pageRelation.content.title}</p>
          </>
        )}
      </Container>

      <PageBuilderModules field={entry.PAGEBUILDER} />
    </>
  );
};

export default HomePage;
