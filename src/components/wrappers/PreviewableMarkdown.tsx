import React from "react";
import MarkdownToJsx from "markdown-to-jsx";
import { PreviewableImage } from "./PreviewableImage";

export const PreviewableMarkdown: React.FC<{ children: string | undefined }> = ({ children: markdown }) => {
  if (!markdown) return null;
  return (
    <MarkdownToJsx
      options={{
        forceBlock: true,
        disableParsingRawHTML: true,
        wrapper: ({ children }) => <div className="prose mx-auto">{children}</div>,
        overrides: {
          img: (props) => (
            <span className="block mx-proseImgOffset">
              <PreviewableImage {...props} />
            </span>
          ),
        },
        slugify: (string) =>
          `hdg--${string
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .replace(/[^\da-z]+/gi, " ")
            .trim()
            .replace(/\s+/gi, "-")}`,
      }}
    >
      {markdown}
    </MarkdownToJsx>
  );
};
