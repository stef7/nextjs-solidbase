import { render, screen } from "@testing-library/react";

import HomePage, { getStaticProps } from "~/pages";

describe(HomePage.name, () => {
  it("renders", () => {
    render(<HomePage entry={{ __type: "home", title: "5" }} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it(getStaticProps.name, async () => {
    const returnValue = await getStaticProps({});

    expect(returnValue).toMatchObject({
      props: {
        testProp: "Hello!",
      },
    });
  });
});
