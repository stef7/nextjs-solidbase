import { render, screen } from "@testing-library/react";

import ThisApp from "~/pages/_app";
import { PageProperties } from "~/types/next";

describe(ThisApp.name, () => {
  it("renders", () => {
    // eslint-disable-next-line unicorn/prevent-abbreviations -- test
    const pageProps: PageProperties<"pages"> = { entry: { __type: "pages", title: "Lorem ipsum" } };
    const Component = ({ entry }: typeof pageProps) => <div>{entry.title}</div>;

    render(<ThisApp {...{ pageProps, Component, ...({} as any) }} />);

    expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
  });
});
