import type { CMS } from "netlify-cms-core";
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import HomePage from "~/pages";
import NewsItemPage from "~/pages/news/[slug]";
import PagesPage from "~/pages/[slug]";
import type { PageWithLayout, PageProperties } from "~/types/next";
import type { ContentAny, ContentKey } from "../content-api";
import { useNewWindowForAllLinks, usePreviewStyleSync } from "./hooks";
import { AppContext } from "~/pages/_app";
import debounce from "lodash.debounce";
import fastDeepEqual from "fast-deep-equal";
import { getContentStatuses } from "../content-status";
import clsx from "clsx";
import NewsIndexPage from "~/pages/news";
import { UnionToIntersection } from "ts-essentials";

const previewTemplateMap: PreviewMap = {
  pages: (p) => <PagesPage {...p} />,
  home: (p) => <HomePage {...p} />,
  news: (p) => <NewsItemPage {...p} />,
  newsIndex: (p) => <NewsIndexPage {...p} items={[]} />,
};

export const PreviewMessage: React.FC<PropsWithChildren<{ level?: "error" | "warning" }>> = ({ children, level }) => (
  <div
    className={clsx("p-container text-2xl text-white", {
      "bg-red-600": level === "error",
      "bg-yellow-600": level !== "error",
    })}
  >
    {children}
  </div>
);
const formatDateTime = (dateString?: string) =>
  dateString &&
  new Date(dateString).toLocaleString("en-au", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "long",
  });

export const registerPreviewTemplates = (cms: CMS) => {
  for (const [key, PageComponent] of Object.entries(previewTemplateMap) as PreviewMapEntries) {
    const PageLayout = PageComponent.layout ?? DefaultLayout;

    const PreviewTemplate: React.FC<PageProperties> = (pageProperties) => {
      useNewWindowForAllLinks();
      usePreviewStyleSync();
      const entry = useMemo(() => pageProperties.entry as UnionToIntersection<ContentAny>, [pageProperties.entry]);
      const contentStatuses = useMemo(() => getContentStatuses(entry), [entry]);
      return (
        <AppContext.Provider value={{ pageProperties, PageComponent }}>
          {contentStatuses[0] === "active" ? (
            entry.expiry && (
              <PreviewMessage level="warning">
                <h1 className="text-4xl font-extrabold">Entry will be unpublished on expiry.</h1>
                <p>Expiry date: {formatDateTime(entry.expiry)}.</p>
              </PreviewMessage>
            )
          ) : (
            <PreviewMessage level="error">
              <h1 className="text-4xl font-extrabold">Entry is {contentStatuses.join("/")}.</h1>
              {entry.expiry && <p>Expiry date: {formatDateTime(entry.expiry)}.</p>}
              {entry.date && <p>Publish date: {formatDateTime(entry.date)}.</p>}
            </PreviewMessage>
          )}
          <PageLayout>
            <PageComponent {...(pageProperties as any)} />
          </PageLayout>
        </AppContext.Provider>
      );
    };

    /** Efficient component re-rendering: https://dmitripavlutin.com/use-react-memo-wisely/ */
    const MemoizedPreview = React.memo(PreviewTemplate, (previous, next) => fastDeepEqual(previous.entry, next.entry));

    cms.registerPreviewTemplate(key, (previewData) => {
      const renderElement = useCallback(
        () => <MemoizedPreview {...{ previewData, entry: previewData.entry.get("data").toJS() }} />,
        [previewData],
      );
      const [rendered, setRendered] = useState(renderElement);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- No dependencies for debounced function
      const debouncedSet = useCallback(debounce(setRendered, 750), []);
      useEffect(() => {
        debouncedSet(renderElement);
      }, [debouncedSet, renderElement]);
      return rendered;
    });
  }
};

type PreviewMap = { [K in ContentKey]: PageWithLayout<PageProperties<K>> };
type PreviewMapEntries = [ContentKey, PageWithLayout][];
