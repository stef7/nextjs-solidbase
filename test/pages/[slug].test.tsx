import { render, screen } from "@testing-library/react";

import SlugPage, { getStaticProps, getStaticPaths } from "~/pages/[slug]";

describe(SlugPage.name, () => {
  it("renders", () => {
    render(<SlugPage _slug="el-sluggo" />);

    expect(screen.getByText("Slug: el-sluggo")).toBeInTheDocument();
  });

  it(getStaticProps.name, async () => {
    const returnValue = await getStaticProps({ params: { slug: "la-slugga" } });

    expect(returnValue).toMatchObject({
      props: { _slug: "la-slugga" },
    });
  });

  it(getStaticPaths.name, async () => {
    const returnValue = await getStaticPaths({});

    expect(returnValue).toMatchObject({
      paths: [{ params: { slug: "about" } }],
      fallback: "blocking",
    });
  });
});
