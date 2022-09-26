import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import React, { useContext, useMemo } from "react";
import type { ImageSizes } from "~/cms/content-api";
import { usePreviewAssetUrl } from "~/cms/preview/hooks";
import { AppContext } from "~/pages/_app";
import type { MarkOptional } from "ts-essentials";
import { tinyDeepForEach } from "~/utils/deep-operations";

const getStaticImage = (src: ImageProps["src"] & object) => ("src" in src ? src : src.default);
const getSrc = (src?: ImageProps["src"]) => src && (typeof src === "string" ? src : getStaticImage(src).src);

const useImageSize = ({
  width,
  height,
  layout,
  src,
  isPreview,
}: {
  width: string | number | undefined;
  height: string | number | undefined;
  src: ImageProps["src"] | undefined;
  isPreview: boolean | undefined;
  layout: ImageProps["layout"];
}) => {
  const appContext = useContext(AppContext);

  const size = useMemo(() => {
    if (width && height) return { width, height };

    if (isPreview || !src || layout === "fill") return;

    if (typeof src === "object") return getStaticImage(src);

    if (!appContext?.pageProperties) return;

    let metaImageSize: ImageSizes[string] | undefined;
    tinyDeepForEach(appContext.pageProperties, (value, key, object) => {
      if (metaImageSize || key === "previewData" || ("__meta" in object && key !== "__meta")) return "continue";
      if (key === "imageSizes" && value[src]) {
        metaImageSize = value[src];
        return "break";
      }
    });
    return metaImageSize;
  }, [width, height, appContext, layout, src, isPreview]);

  return size;
};

export const PreviewableImage: React.FC<MarkOptional<ImageProps, "src">> = ({
  src,
  layout,
  objectFit,
  objectPosition,
  ...universalProperties
}) => {
  const { alt, width, height, title, style, className } = universalProperties;

  // eslint-disable-next-line unicorn/prevent-abbreviations -- reflect name in html
  const srcString = useMemo(() => getSrc(src), [src]);
  const previewAssetUrl = usePreviewAssetUrl(srcString);
  const imageSize = useImageSize({ isPreview: !!previewAssetUrl, width, height, layout, src });

  if (!src) return null;

  if (previewAssetUrl || (layout !== "fill" && !imageSize)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- required when <Image /> can't be used.
      <img
        {...universalProperties}
        {...imageSize}
        alt={alt || title}
        src={previewAssetUrl ?? srcString}
        style={{
          ...style,
          ...(layout === "fill" ? { objectFit, objectPosition } : {}),
        }}
        className={clsx(
          className,
          layout === "fill" && "absolute inset-0 p-0 border-0 m-auto block min-w-full min-h-full max-w-full max-h-full",
        )}
      />
    );
  }

  return (
    <Image {...universalProperties} {...imageSize} alt={alt || title} {...{ src, layout, objectFit, objectPosition }} />
  );
};
