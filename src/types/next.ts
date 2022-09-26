import { PreviewTemplateComponentProps } from "netlify-cms-core";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextComponentType,
  NextPage,
  PreviewData,
} from "next";
import type { AppInitialProps, AppProps } from "next/app";
import type { PropsWithChildren } from "react";
import { StrictOmit } from "ts-essentials";
import { CmsContent, ContentKey } from "~/cms/content-api";

/* eslint-disable unicorn/prevent-abbreviations -- inherits abbreviations in original Next definitions. */

export type PageProperties<K extends ContentKey = ContentKey> = {
  previewData?: PreviewTemplateComponentProps;
  entry: CmsContent<K>;
};

export type Layout = NextPage<PropsWithChildren>;

export type PageWithLayout<P = Partial<PageProperties>, IP = P> = NextPage<P, IP> & {
  layout?: Layout;
};

export type ThisAppPropsWithPageLayout = {
  Component: PageWithLayout<Partial<PageProperties>>;
  pageProps: Partial<PageProperties>;
} & StrictOmit<AppProps, "pageProps" | "Component">;

export type ThisAppContext =
  | {
      PageComponent: ThisAppPropsWithPageLayout["Component"];
      pageProperties: ThisAppPropsWithPageLayout["pageProps"];
    } & Partial<StrictOmit<ThisAppPropsWithPageLayout, "Component" | "pageProps">>;

export type App = NextComponentType<
  ThisAppContext,
  AppInitialProps & Partial<PageProperties>,
  ThisAppPropsWithPageLayout
>;

export type PathsFn<Params extends Record<string, string | string[] | undefined>> = GetStaticPaths<Params>;

type InferGetStaticPathsType<PathsFn extends GetStaticPaths> = PathsFn extends GetStaticPaths<infer Paths>
  ? Paths
  : never;

type StandardProps = StrictOmit<PageProperties, "previewData"> & { previewData?: never }; // { [key: string]: any };

export type PropsFn<
  Props extends StandardProps,
  PathsFn extends GetStaticPaths = GetStaticPaths<{}>,
  PreviewD extends PreviewData = PreviewData,
> = GetStaticProps<Props, PathsFn extends GetStaticPaths ? InferGetStaticPathsType<PathsFn> : never, PreviewD>;

export type Page<PropsF extends PropsFn<StandardProps, GetStaticPaths, PreviewData> | null = null> = PageWithLayout<
  (PropsF extends null ? {} : InferGetStaticPropsType<PropsF>) & PageProperties
>;

/* eslint-enable unicorn/prevent-abbreviations -- closing */
