import React, { useState, useCallback } from "react";
import { Button, Input } from "@chakra-ui/react";
import { mintNft } from "@/util/program/mint";

const MintButton: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleMint = useCallback(async () => {
    if (!imageFile) {
      alert("Please select an image file first.");
      return;
    }
    try {
      await mintNft(imageFile);
      alert("Minting completed successfully!");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed, check the console for errors.");
    }
  }, [imageFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  return (
    <>
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleMint} colorScheme="purple" size="lg">
        Mint your NFT
      </Button>
    </>
  );
};

export default MintButton;
