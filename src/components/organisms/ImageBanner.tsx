import { PreviewableImage } from "../wrappers/PreviewableImage";
import { Container } from "./Container";

export const ImageBanner: React.FC<{ image: string }> = ({ image }) => {
  return (
    <Container relative>
      <div className="pt-[30%]">
        <PreviewableImage
          src={image}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="z-containBg pointer-events-none"
        />
      </div>
    </Container>
  );
};
