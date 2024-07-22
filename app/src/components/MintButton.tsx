// import React from "react";
// import { Button } from "@chakra-ui/react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { mintNFT } from "../util/program/mint";

// const MintButton: React.FC = () => {
//   const wallet = useWallet();

//   const handleMint = async () => {
//     try {
//       await mintNFT(wallet);
//       alert("Minting completed successfully!");
//     } catch (error) {
//       console.error("Minting failed:", error);
//       alert("Minting failed, check the console for errors.");
//     }
//   };

//   return (
//     <Button onClick={handleMint} colorScheme="purple" size="lg">
//       Mint your prediction
//     </Button>
//   );
// };

// export default MintButton;

import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintNFT } from "../util/program/mint";

const MintButton: React.FC = () => {
  const wallet = useWallet();

  const handleMint = async () => {
    try {
      await mintNFT(wallet);
      alert("Minting completed successfully!");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed, check the console for errors.");
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="20vh">
      <Button
        onClick={handleMint}
        colorScheme="purple"
        size="lg"
        fontSize="1.5rem"
        padding="2rem 4rem"
      >
        Mint your prediction
      </Button>
    </Flex>
  );
};

export default MintButton;
