// src/components/Card.tsx
import { Box, Image, Text } from "@chakra-ui/react";

interface CardProps {
  image: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ image, title, description }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
    >
      <Image src={image} alt={title} />
      <Box p={4}>
        <Text fontWeight="bold" fontSize="xl" mb={2}>
          {title}
        </Text>
        <Text fontSize="md">{description}</Text>
      </Box>
    </Box>
  );
};

export default Card;
