import Link from "next/link";
import { CmsContent, CmsFolderContent, getContent, getFolderContent } from "~/cms/content-api";
import { Container } from "~/components/organisms/Container";
import { PageBuilderModules } from "~/components/wrappers/PageBuilderModules";
import { pagesPath } from "~/utils/$path";
import { easyMap } from "~/utils/easy-rendering";
import { Page, PropsFn } from "~/types/next";

export const getStaticProps: PropsFn<{
  entry: CmsContent<"newsIndex">;
  items: CmsFolderContent<"news", "title" | "author" | "date" | "intro">;
}> = async () => {
  const entry = getContent("newsIndex");
  if (!entry) return { notFound: true };
  const items = getFolderContent("news", ["title", "author", "date", "intro"]);
  return {
    props: { entry, items },
  };
};

const NewsIndexPage: Page<typeof getStaticProps> = ({ entry, items }) => {
  return (
    <>
      <PageBuilderModules field={entry.PAGEBUILDER} />
      <Container>
        {easyMap(
          items,
          (item, key) => (
            <li className="my-2" key={key}>
              <Link href={pagesPath.news._slug(item.__slug[0]).$url()}>
                <a>
                  <h2>{item.title}</h2>
                  <p className="text-sm">{item.date}</p>
                  <p>{item.intro}</p>
                </a>
              </Link>
            </li>
          ),
          (kids) => (
            <ul className="list-disc my-4">{kids}</ul>
          ),
        )}
      </Container>
    </>
  );
};

export default NewsIndexPage;
