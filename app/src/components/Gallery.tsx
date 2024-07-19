// src/components/Gallery.tsx
import { SimpleGrid } from "@chakra-ui/react";
import Card from "./Card";

interface ImageProps {
  src: string;
  title: string;
  description: string;
}

interface GalleryProps {
  images: ImageProps[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
      {images.map((image, index) => (
        <Card
          key={index}
          image={image.src}
          title={image.title}
          description={image.description}
        />
      ))}
    </SimpleGrid>
  );
};

export default Gallery;
