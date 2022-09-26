/* eslint-disable */
/* tslint:disable */

export interface home_PAGEBUILDER_ImageBannerWithContent_buttons {
  text: string;
  link: string;
}

export interface home_PAGEBUILDER_RichContent {
  type: "RichContent";
  markdown: string;
}

export interface home_PAGEBUILDER_ImageBanner {
  type: "ImageBanner";
  image: string;
}

export interface home_PAGEBUILDER_ImageBannerWithContent {
  type: "ImageBannerWithContent";
  image: string;
  heading: string;
  markdown: string;
  buttons: home_PAGEBUILDER_ImageBannerWithContent_buttons[];
}

export interface home {
  PAGEBUILDER: (home_PAGEBUILDER_RichContent | home_PAGEBUILDER_ImageBanner | home_PAGEBUILDER_ImageBannerWithContent)[];
  newsItems?: string[];
  pageRelation?: string;
}

export interface newsIndex_PAGEBUILDER_ImageBannerWithContent_buttons {
  text: string;
  link: string;
}

export interface newsIndex_PAGEBUILDER_RichContent {
  type: "RichContent";
  markdown: string;
}

export interface newsIndex_PAGEBUILDER_ImageBanner {
  type: "ImageBanner";
  image: string;
}

export interface newsIndex_PAGEBUILDER_ImageBannerWithContent {
  type: "ImageBannerWithContent";
  image: string;
  heading: string;
  markdown: string;
  buttons: newsIndex_PAGEBUILDER_ImageBannerWithContent_buttons[];
}

export interface newsIndex {
  PAGEBUILDER: (newsIndex_PAGEBUILDER_RichContent | newsIndex_PAGEBUILDER_ImageBanner | newsIndex_PAGEBUILDER_ImageBannerWithContent)[];
}

export interface pages_PAGEBUILDER_ImageBannerWithContent_buttons {
  text: string;
  link: string;
}

export interface pages_PAGEBUILDER_RichContent {
  type: "RichContent";
  markdown: string;
}

export interface pages_PAGEBUILDER_ImageBanner {
  type: "ImageBanner";
  image: string;
}

export interface pages_PAGEBUILDER_ImageBannerWithContent {
  type: "ImageBannerWithContent";
  image: string;
  heading: string;
  markdown: string;
  buttons: pages_PAGEBUILDER_ImageBannerWithContent_buttons[];
}

export interface pages {
  title: string;
  date?: string;
  expiry?: string;
  disabled?: boolean;
  PAGEBUILDER: (pages_PAGEBUILDER_RichContent | pages_PAGEBUILDER_ImageBanner | pages_PAGEBUILDER_ImageBannerWithContent)[];
  newsItems?: string[];
  pageRelation?: string;
}

export interface news {
  title: string;
  date?: string;
  expiry?: string;
  disabled?: boolean;
  author: string;
  thumbnail: string;
  intro: string;
  newsItems?: string[];
  pageRelation?: string;
  singlePageRelation?: string;
}

export type ALL_NCMS_GENERATED={home:home;newsIndex:newsIndex;pages:pages;news:news};
export type ALL_NCMS_FILECOLLS={singlePages:"home"|"newsIndex"};