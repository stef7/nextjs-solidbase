import { render, screen } from "@testing-library/react";

import App from "~/pages/_app";

describe(App.name, () => {
  it("renders", () => {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    const pageProps: { text: string } = { text: "App text." };
    const Component = ({ text }: typeof pageProps) => <div>{text}</div>;

    render(<App {...{ pageProps, Component, router: {} as any }} />);

    expect(screen.getByText("App text.")).toBeInTheDocument();
  });
});
