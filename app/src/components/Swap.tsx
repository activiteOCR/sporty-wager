import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TOKENS } from "../util/constants";
import { getQuote } from "../util/jupiter.helper";
import { sendSwapTransaction } from "../util/helper";
import {
  Flex,
  Box,
  Input,
  Select,
  Button,
  Text,
  Heading,
  Spinner,
} from "@chakra-ui/react";

export function Swap() {
  const [token1, setToken1] = useState<string>("");
  const [token2, setToken2] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [requestQuote, setRequestQuote] = useState<boolean>(false);
  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const wallet = useWallet();

  const getJupiterQuote = async () => {
    try {
      setTransactionHash("");
      setQuote(null);
      setSendingTransaction(false);
      const token = TOKENS.find((token) => token.mintAddress === token1);
      if (!token) return;
      setRequestQuote(true);
      const quote = await getQuote(
        amount * 10 ** token.decimals,
        token1,
        token2
      );
      setQuote(quote);
      setRequestQuote(false);
    } catch (error) {
      console.error(error);
      setRequestQuote(false);
    }
  };

  const swap = async () => {
    try {
      if (!wallet.publicKey) return;
      const token = TOKENS.find((token) => token.mintAddress === token1);
      if (!token) return;
      setSendingTransaction(true);
      const swapTransaction = await sendSwapTransaction(
        wallet,
        amount * 10 ** token.decimals,
        token1,
        token2
      );
      if (swapTransaction) {
        setTransactionHash(swapTransaction);
      }
      setSendingTransaction(false);
    } catch (error) {
      console.error(error);
      setSendingTransaction(false);
    }
  };

  useEffect(() => {
    setQuote(null);
  }, [token1, token2, amount]);

  return (
    <Flex direction="column" w="100%" align="center" mt="1rem" p={2}>
      <Heading as="h1" mb={3}>
        Swap
      </Heading>
      <Flex direction="column" gap={2} width="100%" maxW="500px">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Select
          value={token1}
          onChange={(e) => setToken1(e.target.value)}
          placeholder="Select token"
        >
          {TOKENS.filter((token) => token.mintAddress !== token2).map(
            (token) => (
              <option key={`token1-${token.name}`} value={token.mintAddress}>
                {token.name}
              </option>
            )
          )}
        </Select>
        <Text textAlign="center">FOR</Text>
        <Select
          value={token2}
          onChange={(e) => setToken2(e.target.value)}
          placeholder="Select token"
        >
          {TOKENS.filter((token) => token.mintAddress !== token1).map(
            (token) => (
              <option key={`token2-${token.name}`} value={token.mintAddress}>
                {token.name}
              </option>
            )
          )}
        </Select>
        {requestQuote ? (
          <Spinner size="md" />
        ) : (
          <Button onClick={getJupiterQuote} colorScheme="purple">
            Get Quote
          </Button>
        )}
      </Flex>
      {quote && (
        <Box
          mt={6}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          w="100%"
          maxW="500px"
        >
          <Heading as="h2" size="lg" mb={4}>
            Quote
          </Heading>
          <Text>
            In Amount:{" "}
            {+quote.inAmount /
              10 **
                (TOKENS?.find((token) => token?.mintAddress === token1)
                  ?.decimals ?? 1)}
          </Text>
          <Text>
            Out Amount:{" "}
            {+quote.outAmount /
              10 **
                (TOKENS?.find((token) => token?.mintAddress === token2)
                  ?.decimals ?? 1)}
          </Text>
          <Text>
            Price: $
            {+quote.inAmount /
              10 **
                (TOKENS?.find((token) => token?.mintAddress === token1)
                  ?.decimals ?? 1) /
              (+quote.outAmount /
                10 **
                  (TOKENS?.find((token) => token?.mintAddress === token2)
                    ?.decimals ?? 1))}
          </Text>
          <Text>
            Route Plan:
            <Flex direction="column" gap={2} mt={2}>
              {quote.routePlan.map((route: RoutePlan, index: number) => (
                <Flex key={index} gap={2}>
                  <Text>{route.percent}%</Text>
                  <Text>{route.swapInfo.label}</Text>
                </Flex>
              ))}
            </Flex>
          </Text>
          {sendingTransaction ? (
            <Text>Sending transaction...</Text>
          ) : (
            <Button onClick={swap} gap={2} mt={4} w="full" colorScheme="purple">
              Swap
            </Button>
          )}
          {transactionHash && (
            <Text mt={4}>Transaction hash: {transactionHash}</Text>
          )}
        </Box>
      )}
    </Flex>
  );
}
