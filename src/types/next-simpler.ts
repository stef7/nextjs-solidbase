import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextComponentType,
  NextPage,
  PreviewData,
} from "next";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import type { PropsWithChildren, ReactElement } from "react";

/* eslint-disable unicorn/prevent-abbreviations */

export type Layout = NextPage<PropsWithChildren & AppProps>;

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  layout?: Layout;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type NextApp = NextComponentType<AppContext, AppInitialProps, AppPropsWithLayout>;

export type PathsFn<Params extends Record<string, string | string[] | undefined>> = GetStaticPaths<Params>;

type InferGetStaticPathsType<PathsFn extends GetStaticPaths> = PathsFn extends GetStaticPaths<infer Paths>
  ? Paths
  : never;

type StdProps = { [key: string]: any };

export type PropsFn<
  Props extends StdProps,
  PathsFn extends GetStaticPaths = GetStaticPaths<{}>,
  PreviewD extends PreviewData = PreviewData,
> = GetStaticProps<Props, PathsFn extends GetStaticPaths ? InferGetStaticPathsType<PathsFn> : never, PreviewD>;

export type Page<PropsF extends PropsFn<StdProps, GetStaticPaths, PreviewData> | null = null> = NextPageWithLayout<
  PropsF extends null ? {} : InferGetStaticPropsType<PropsF>
>;
