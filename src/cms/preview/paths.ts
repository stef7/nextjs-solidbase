import { pagesPath } from "~/utils/$path";

export const getPreviewPath = (
  getter: (p: typeof pagesPath) => { $url: () => { pathname: string; query?: Record<string, string | number> } },
) => {
  const nextUrl = getter(pagesPath).$url();
  let realPath = nextUrl.pathname;
  if (nextUrl.query)
    for (const [key, value] of Object.entries(nextUrl.query)) realPath = realPath.replaceAll(`[${key}]`, String(value));
  return realPath;
};
