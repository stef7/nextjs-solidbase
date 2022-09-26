import { useContext, useMemo } from "react";
import type { ContentKey, Relation } from "~/cms/content-api";
import { AppContext } from "~/pages/_app";
import { tinyDeepForEach } from "../utils/deep-operations";
import type { ThisAppContext } from "../types/next";

export const getContentRelations = <K extends ContentKey = ContentKey>(
  appContext: ThisAppContext | null,
  relationKeys: (string | undefined)[] | undefined,
) => {
  if (!relationKeys?.length || !appContext?.pageProperties) return [];

  const metaRelations: Relation<K>[] = [];
  tinyDeepForEach(appContext.pageProperties, (value, key, object) => {
    if (key === "previewData" || ("__meta" in object && key !== "__meta")) return "continue";
    if (key === "relations")
      for (const key of Object.keys(value)) {
        if (relationKeys?.includes(key) && value[key]) metaRelations.push(value[key]);
      }
  });
  return metaRelations;
};

export const useContentRelations = <K extends ContentKey = ContentKey>(
  relationKeys: (string | undefined)[] | undefined,
) => {
  const appContext = useContext(AppContext);
  return useMemo(() => getContentRelations<K>(appContext, relationKeys), [appContext, relationKeys]);
};
