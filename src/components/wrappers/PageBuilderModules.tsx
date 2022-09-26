import React, { useMemo, useState } from "react";
import hashSum from "hash-sum";
import type { ModuleComponent, ModuleKey, ModuleMap, PageBuilderField } from "~/cms/content-api";
import { PreviewableMarkdown } from "./PreviewableMarkdown";
import { Container } from "../organisms/Container";
import { usePreviewData } from "~/cms/preview/hooks";
import fastDeepEqualReact from "fast-deep-equal/react";
import { PreviewMessage } from "~/cms/preview/templates";
import { logError } from "~/utils/monitoring";
import { ImageBanner } from "../organisms/ImageBanner";
import { ImageBannerWithContent } from "../organisms/ImageBannerWithContent";

const moduleMap: ModuleMap = {
  ImageBanner: ({ image }) => {
    return image ? <ImageBanner image={image} /> : null;
  },

  ImageBannerWithContent: ({ buttons, heading, image, markdown }) => {
    return <ImageBannerWithContent {...{ buttons, heading, image, markdown }} />;
  },

  RichContent: ({ markdown }) => {
    return <Container>{markdown && <PreviewableMarkdown>{markdown}</PreviewableMarkdown>}</Container>;
  },
};

/** Uses efficient component re-rendering: https://dmitripavlutin.com/use-react-memo-wisely/ */
const memoizedModules = {
  _cache: new Map<ModuleKey, ModuleComponent>(),
  get(key: ModuleKey) {
    if (!this._cache.has(key) && moduleMap[key])
      this._cache.set(
        key,
        React.memo(moduleMap[key], (previous, next) => previous.hash === next.hash) as ModuleComponent,
      );
    return this._cache.get(key)!;
  },
};

/** Uses efficient component re-rendering: https://dmitripavlutin.com/use-react-memo-wisely/ */
const PreviewPageBuilder: React.FC<{ field: PageBuilderField }> = ({ field }) => {
  const hashArray = useMemo(() => field?.map((item, index) => `${index}-${item!.type!}-${hashSum(item)}`), [field]);
  const [hashCache, setHashCache] = useState<string>();
  const [renderCache, setRenderCache] = useState<Record<React.Key, JSX.Element>>({});

  return useMemo(() => {
    if (!field || !hashArray) return <></>;

    const thisRender: typeof renderCache = {};

    const hashNow = hashArray.join(",");
    if (hashCache !== hashNow) {
      for (const [index, item] of field.entries() ?? []) {
        if (!item?.type) continue;

        const hash = hashArray[index]!;

        thisRender[hash] =
          renderCache[hash] ??
          (() => {
            const MemoizedComponent = memoizedModules.get(item.type);
            return MemoizedComponent ? (
              <MemoizedComponent key={hash} hash={hash} {...item} />
            ) : (
              <PreviewMessage level="error" key={hash}>
                <p>Error: no component mapped to &ldquo;{item.type}&rdquo; module type.</p>
              </PreviewMessage>
            );
          })();
      }

      setRenderCache(thisRender);
      setHashCache(hashNow);
    }

    return <>{Object.values(renderCache)}</>;
  }, [renderCache, field, hashArray, hashCache]);
};
/** Uses efficient component re-rendering: https://dmitripavlutin.com/use-react-memo-wisely/ */
const MemoizedPreviewPageBuilder = React.memo(PreviewPageBuilder, fastDeepEqualReact);

export const PageBuilderModules: React.FC<{ field: PageBuilderField }> = ({ field }) => {
  return usePreviewData() ? (
    <MemoizedPreviewPageBuilder {...{ field }} />
  ) : (
    <>
      {field?.map((item, index) => {
        if (!item?.type) return;
        const MappedComponent = moduleMap[item.type] as ModuleComponent;
        if (!MappedComponent) return logError(`No component mapped to "${item.type}" module type.`);
        const hash = `${index}-${item.type}-${hashSum(item)}`;
        return <MappedComponent {...item} hash={hash} key={hash} />;
      })}
    </>
  );
};
