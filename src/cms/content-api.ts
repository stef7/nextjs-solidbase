import { read, list } from "fs-jetpack";
import grayMatter from "gray-matter";
import { sync as probeImageSizeSync } from "probe-image-size";
import { DeepPartial } from "ts-essentials";
import { cmsCollections } from "~/cms/config/collections";
import { ALL_NCMS_GENERATED } from "~/cms/types-generated";
import { PageBuilderKey } from "./config/page-builder";
import { tinyDeepForEach } from "~/utils/deep-operations";
import { getContentStatus } from "./content-status";
import { logWarn } from "~/utils/monitoring";

const imageUrlRegex = /\/cms-uploads\/.*\.(?:avif|bmp|gif|ico|jpe?g|png|psd|svg|tiff|webp)(?=\W|$)/giu;
const relationRegex = /^RelationTo:(\S+)(?: ItemSlug:(\S+))?$/u;

const getMetaData = (object: object, seen = new Set<string>()): MetaData => {
  let imageSizes: MetaData["imageSizes"];
  let relations: MetaData["relations"];

  tinyDeepForEach(object, (value) => {
    if (typeof value === "string") {
      for (const url of value.match(imageUrlRegex) ?? []) {
        if (!imageSizes?.[url] && (seen.has(url) || !seen.add(url))) {
          (imageSizes ?? (imageSizes = {}))[url] = null;
        } else {
          const buffer = read(`public${url}`, "buffer");
          const result = buffer && probeImageSizeSync(buffer);
          if (result) {
            (imageSizes ?? (imageSizes = {}))[url] = { width: result.width, height: result.height };
          } else logWarn(`${url} not found.`);
        }
      }

      const [relationKey, relationTo, itemSlug] = value.match(relationRegex) ?? [];
      if (relationKey && !relations?.[relationKey] && relationTo) {
        if (
          seen.has(`getContent: ${relationTo} ${itemSlug}`) ||
          seen.has(`getContent: ${itemSlug} (file)`) ||
          seen.has(relationKey) ||
          !seen.add(relationKey)
        ) {
          (relations ?? (relations = {}))[relationKey] = null;
        } else {
          const content =
            getContent(relationTo as ContentKey, itemSlug, seen) ?? getContent(itemSlug as ContentKey, undefined, seen);
          if (content) {
            (relations ?? (relations = {}))[relationKey] = { relationTo, itemSlug, content };
          } else logWarn(`${relationKey} not found.`);
        }
      }
    }
  });

  return {
    ...(imageSizes ? { imageSizes } : {}),
    ...(relations ? { relations } : {}),
  };
};

const getFolderPathsOnly = <K extends ContentKey>(folderName: K) => {
  const folderColl = cmsCollections.find((c) => c.folder && c.name === folderName);
  if (!folderColl) throw new Error(`No folder collection '${folderName}'`);
  const paths = list(folderColl.folder);
  if (!paths) throw new Error(`No paths for folder '${folderColl.folder}'`);
  const fullPaths = paths.map((path) => `${folderColl.folder}/${path}`);
  return { paths, fullPaths };
};

export const getFolderPaths = <K extends ContentKey>(folderName: K) => {
  const { paths, fullPaths } = getFolderPathsOnly(folderName);
  const slugs = paths.map((path) => path.replace(/(?:[/\\]index)?\.md$/i, "").split("/")) as [string, ...string[]][];
  return { paths, fullPaths, slugs };
};

export const readMdYaml = <K extends ContentKey = ContentKey>(path?: string) => {
  if (!path) return;
  const fileString = read(path);
  if (!fileString) return;
  const { data, content: body } = grayMatter(fileString);
  return {
    content: { ...data, ...(body ? { body } : {}) } as ContentAny<K>,
    fileString,
  };
};

type CmsFolderContentItem<K extends ContentKey, F extends keyof ContentAny<K>> = { [K2 in F]: ContentAny<K>[K2] } & {
  __type: K;
  // __path: string;
  __slug: [string, ...string[]];
};
export type CmsFolderContent<K extends ContentKey, F extends keyof ContentAny<K>> = CmsFolderContentItem<K, F>[];
export const getFolderContent = <K extends ContentKey, F extends keyof ContentAny<K>>(
  folderName: K,
  fieldNames: F[],
) => {
  const { fullPaths, slugs } = getFolderPaths(folderName);
  return fullPaths
    .map((fullPath, index) => ({
      content: readMdYaml(fullPath)?.content as ContentAny<K>,
      __type: folderName,
      // __path: fullPath,
      __slug: slugs[index],
    }))
    .filter(({ content }) => getContentStatus(content) === "active")
    .map(
      ({ content, ...rest }) =>
        ({
          ...Object.fromEntries(fieldNames.map((name) => [name, content[name]])),
          ...rest,
        } as CmsFolderContentItem<K, F>),
    );
};

const findConfig = <K extends ContentKey>(name: K) => {
  for (const c of cmsCollections) {
    if (c.folder && c.name === name) return { folderCollection: c };
    if (c.files)
      for (const f of c.files) {
        if (f.name === name) return { fileCollection: c, file: f };
      }
  }
};

export const getContent = <K extends ContentKey, S extends string | string[] | undefined>(
  name: K,
  folderItemSlug?: S,
  metaDataCycleSeen = new Set<string>().add(`getContent: ${name} ${folderItemSlug ?? "(file)"}`),
): CmsContent<K, S> | void => {
  const config = findConfig(name);
  if (!config) return;

  const { folderCollection, file } = config;

  const path = (() => {
    if (folderCollection) {
      if (Array.isArray(folderItemSlug)) return [folderCollection.folder, ...folderItemSlug, "index.md"].join("/");
      return folderItemSlug && `${folderCollection.folder}/${folderItemSlug}.md`;
    }
    return file.file;
  })();

  const { fileString, content } = readMdYaml<K>(path) ?? {};
  const status = getContentStatus(content);
  if (status !== "active" || !fileString || !content)
    return logWarn(`Content "${name}"${folderItemSlug ? ` > "${folderItemSlug}"` : ``} is ${status}.`);

  const metaData = getMetaData(content, metaDataCycleSeen);

  return {
    ...content,
    __type: name,
    ...(folderItemSlug ? { __slug: folderItemSlug } : {}),
    ...(metaData ? { __meta: metaData } : {}),
  };
};

type AG = ALL_NCMS_GENERATED;
export type ContentKey = Extract<keyof AG, string>;
type ContentAll = { [K in keyof AG]: DeepPartial<AG[K]> };
export type ContentAny<K extends ContentKey = ContentKey> = ContentAll[K];
export type CmsContent<
  K extends ContentKey = ContentKey,
  S extends string | string[] | undefined = string | string[] | undefined,
> = ContentAny<K> & { __type: K; __slug?: S; __meta?: MetaData };
export type ImageSize = { width: number; height: number };
export type ImageSizes = Record<string, Readonly<ImageSize> | null>;
export type Relation<K extends ContentKey = ContentKey> = {
  relationTo: K | (string & {});
  itemSlug?: string;
  content: ContentAny<K>;
};
export type Relations = Record<string, Readonly<Relation> | null>;
type MetaData = { imageSizes?: ImageSizes; relations?: Relations };

export type PageBuilderField = {
  [K in ContentKey]: {
    [K2 in keyof ContentAny<K> & PageBuilderKey]: ContentAny<K>[K2];
  }[keyof ContentAny<K> & PageBuilderKey];
}[ContentKey];
type Module = NonNullable<PageBuilderField>[number];
export type ModuleKey = NonNullable<NonNullable<Module>["type"]>;
type ModuleByKey<K extends ModuleKey> = Extract<Module, { type?: K }>;
export type ModuleComponent<K extends ModuleKey = ModuleKey> = React.FC<ModuleByKey<K> & { hash: string }>;
export type ModuleMap = { [K in ModuleKey]: ModuleComponent<K> };
