import { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { registerables } from "chart.js";
import dynamic from "next/dynamic";
const Wallets = dynamic(() => import("../components/WalletButton"), {
  ssr: false,
});

export const Navbar = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  return (
    <Flex
      zIndex="10"
      bg="black"
      h="1rem"
      w="100%"
      justify="space-between"
      align="center"
      p="9"
    >
      <Text
        fontSize="1.2rem"
        color="white"
        fontWeight={600}
        bg="purple.500"
        padding="0.5rem 2rem"
        borderRadius="1rem"
      >
        Sporty Wager
      </Text>
      {publicKey && balance !== null && (
        <Text color="white" fontWeight={600}>
          Balance: {balance.toFixed(2)} SOL
        </Text>
      )}
      <Wallets setPublicKey={setPublicKey} setBalance={setBalance} />
    </Flex>
  );
};
