import Link from "next/link";
import { easyMap } from "~/utils/easy-rendering";
import { PreviewableMarkdown } from "../wrappers/PreviewableMarkdown";
import { PreviewableImage } from "../wrappers/PreviewableImage";
import { Container } from "./Container";

export const ImageBannerWithContent: React.FC<{
  image?: string;
  heading?: string;
  markdown?: string;
  buttons?: ({ link?: string; text?: string } | undefined)[] | undefined;
}> = ({ image, heading, markdown, buttons }) => {
  return (
    <Container relative={!!image}>
      {image && (
        <PreviewableImage
          src={image}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="z-containBg opacity-10 pointer-events-none"
        />
      )}

      <div className="z-aboveContainBg relative">
        {heading && <h1>{heading}</h1>}

        {markdown && <PreviewableMarkdown>{markdown}</PreviewableMarkdown>}

        {easyMap(
          buttons,
          (button, key) =>
            button.link &&
            button.text && (
              <li key={key}>
                <Link href={button.link}>
                  <a className="inline-flex p-4 bg-red-600 text-white my-1 ml-3">{button.text}</a>
                </Link>
              </li>
            ),
          (children) => (
            <ul className="flex flex-wrap -ml-3">{children}</ul>
          ),
        )}
      </div>
    </Container>
  );
};
