import { CmsFieldBase, CmsFieldList, CmsFieldObject } from "netlify-cms-core";
import { StrictOmit } from "ts-essentials";

export const pageBuilderPrefix = `PAGEBUILDER` as const;

const typeModules = <O extends Record<string, ModuleConfig>>(modules: O) => modules;

const pageBuilderModules = typeModules({
  RichContent: {
    widget: "object",
    label: "Rich Content",
    summary: "{{markdown}}",
    fields: [
      {
        widget: "markdown",
        name: "markdown",
      },
    ],
  },

  ImageBanner: {
    widget: "object",
    label: "Image Banner",
    summary: "{{heading}} {{image}} {{markdown}}",
    fields: [
      {
        widget: "image",
        name: "image",
      },
    ],
  },

  ImageBannerWithContent: {
    widget: "object",
    label: "Image Banner",
    summary: "{{heading}} {{image}} {{markdown}}",
    fields: [
      {
        widget: "image",
        name: "image",
      },
      {
        widget: "string",
        name: "heading",
        hint: "Used as H1 (Heading 1) so must describe the entire page's content e.g. 'News' for the list of news items.",
      },
      {
        widget: "markdown",
        name: "markdown",
        buttons: ["link"],
      },
      {
        widget: "list",
        name: "buttons",
        fields: [
          { widget: "string", name: "text" },
          {
            widget: "string",
            name: "link",
            pattern: [
              "^(?:https?:\\/\\/[^\\s]+(?:\\.[^\\s]+)+(?:\\/[^\\s]*)*|\\/(?:[^\\s]*)+)$",
              'Must be valid link (external links start with "https://" or "http://", internal links start with "/")',
            ],
          },
        ],
      },
    ],
  },
});

export const createPageBuilder = <M extends ModuleKeys, N extends string = "">(moduleKeys?: M[], name?: N) => {
  return {
    widget: "list",
    name: `${pageBuilderPrefix}${name ? "_" + name : ""}`,
    label: "Modules",
    label_singular: "Module",
    types: (moduleKeys?.length ? [...new Set(moduleKeys)] : (Object.keys(pageBuilderModules) as M[])).map((name) => ({
      ...pageBuilderModules[name],
      name,
    })),
  } as PageBuilder<M, N>;
};

type ModuleConfig<N extends string = string> = {
  [K in N]: StrictOmit<CmsFieldBase & CmsFieldObject, "name"> & (string extends N ? {} : { name: N });
}[N];
type ModuleKeys = keyof typeof pageBuilderModules;
export type PageBuilderKey<S extends "" | (string & {}) = "" | (string & {})> =
  `${typeof pageBuilderPrefix}${S extends "" ? S : `_${S}`}`;
type PageBuilder<MN extends string, N extends string = string> = CmsFieldBase &
  CmsFieldList & { types: ModuleConfig<MN>[]; name: PageBuilderKey<N> };
