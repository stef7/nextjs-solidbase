import debounce from "lodash.debounce";
import { useCallback, useContext, useEffect, useInsertionEffect, useLayoutEffect, useMemo, useState } from "react";
import { AppContext } from "~/pages/_app";

export const usePreviewData = <EO extends boolean = false>(emptyObject?: EO) =>
  useContext(AppContext)?.pageProperties.previewData ??
  ((emptyObject ? {} : null) as EO extends true ? Record<string, undefined> : null);

export const usePreviewAssetUrl = <A extends string>(asset?: A) => {
  const { getAsset } = usePreviewData(true);
  return useMemo(() => asset && getAsset?.(asset).url, [getAsset, asset]);
};

const getPreviewIframe = () => document.querySelector("#preview-pane") as HTMLIFrameElement | null;
const getPreviewDocument = () => getPreviewIframe()?.contentDocument;

export const useNewWindowForAllLinks = () => {
  useEffect(() => {
    const previewDocument = getPreviewDocument();
    if (!previewDocument) return;
    const listener = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest("a");
      if (link && (!link.target || link.target === "_self")) {
        event.preventDefault();
        window.open(link.href);
      }
    };
    previewDocument.addEventListener("click", listener, { capture: true });
    return () => {
      previewDocument.removeEventListener("click", listener, { capture: true });
    };
  }, []);
};

export type StyleElements = {
  styles: HTMLStyleElement[];
  links: HTMLLinkElement[];
};
export const getDocumentStyles = ({ head }: Document): StyleElements => ({
  styles: [...head.querySelectorAll<HTMLStyleElement>("style:not([data-emotion])")],
  links: [...head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')],
});

export const useDocumentStyles = <D extends Document | null | undefined>(document: D) => {
  const [elements, setElements] = useState<StyleElements | (D extends null | undefined ? null | undefined : never)>(
    document && getDocumentStyles(document),
  );
  useEffect(() => {
    if (!document) return;
    setElements(getDocumentStyles(document));
    const observer = new MutationObserver(() => {
      const styles = getDocumentStyles(document);
      for (const style of styles.styles) observer.observe(style, { characterData: true });
      for (const link of styles.links) observer.observe(link, { attributeFilter: ["href"] });
      setElements(styles);
    });
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, [document]);
  return elements;
};

/**
 * The usual way to add preview styles is to use `cms.registerPreviewStyle`,
 * but styles added that way styles cannot be removed or unregistered.
 * So each time the top styles change, we must delete all preview styles
 * and replace them with fresh clones of the top styles.
 */
export const usePreviewStyleSync = () => {
  const topStyles = useDocumentStyles(top?.document);
  const previewDocument = useMemo(() => getPreviewDocument(), []);

  const clone = useCallback(
    () =>
      previewDocument?.head.replaceChildren(
        ...[...previewDocument.head.children].filter((x) => !x.matches(`style, link[rel="stylesheet"]`)),
        ...(topStyles?.links.map((x) => x.cloneNode(true)) ?? []),
        ...(topStyles?.styles.map((x) => x.cloneNode(true)) ?? []),
      ),
    [previewDocument, topStyles],
  );
  const debouncedClone = useCallback(debounce(clone, 200), [clone]);

  useInsertionEffect(() => {
    clone();
  }, []);
  useLayoutEffect(() => {
    debouncedClone();
  }, [debouncedClone]);
};
