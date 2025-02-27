import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Button,
  useDisclosure,
  Text,
  useToast,
  Center,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { AddItem } from "./AddItem";
import { getExpenses } from "@/util/program/getExpenses";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { truncatedPublicKey } from "@/util/helper";
import { Expense } from "@/types/expense";
import { deleteExpense } from "@/util/program/deleteExpense";
import { UpdateItem } from "./UpdateItem";
import { DistributionChart } from "./DistributionChart";
import NoSRR from "react-no-ssr";

interface MyExpensesProps {
  images: { src: string; title: string; description: string }[];
}

export const MyExpenses = ({ images }: MyExpensesProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentValues, setCurrentValues] = useState<any>({});
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const wallet = useAnchorWallet();
  const toast = useToast();

  useEffect(() => {
    if (!wallet) {
      setExpenses([]);
      return;
    }
    const run = async () => {
      const data = await getExpenses(wallet as NodeWallet);
      setExpenses(data);
    };
    run();
  }, [wallet]);

  const handleRemove = async (id: number) => {
    if (!wallet) {
      toast({
        status: "error",
        title: "Connect Wallet Required",
      });
      return;
    }
    const sig = await deleteExpense(wallet as NodeWallet, id);
    console.log(sig);

    if (sig) {
      toast({
        status: "success",
        title: "Removed expense entry",
      });
    }
    const data = await getExpenses(wallet as NodeWallet);
    setExpenses(data);
  };

  const handleUpdate = async (expense: Expense) => {
    setCurrentValues({
      id: expense.id,
      pubKey: expense.pubKey,
      amount: expense.amount,
      merchant: expense.merchant,
      prediction: expense.prediction, // Include prediction
    });

    onOpen2();
  };

  return (
    <Flex
      w="100%"
      h="80vh"
      align="start"
      mt="10rem"
      justifyContent="space-around"
    >
      <Flex flexFlow="column" gap="2rem">
        <Flex justify="space-between">
          <Button
            onClick={onOpen}
            w="14rem"
            leftIcon={<AddIcon sx={{ mb: "4px" }} />}
            mt={4}
            colorScheme="purple"
            fontSize="1.4rem"
            p="4px 0 0 0"
          >
            Add Prediction
          </Button>
        </Flex>
        <Box
          w="100%"
          p="2rem 1rem"
          boxShadow="0px 5px 20px #f1f1f5"
          border="1px solid"
          borderColor="purple.400"
          borderRadius="1rem"
          fontSize="2rem"
        >
          <NoSRR>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th
                    sx={{ textTransform: "none" }}
                    fontSize="1.4rem"
                    color="white"
                    fontWeight={400}
                  >
                    Wager selection
                  </Th>
                  <Th
                    sx={{ textTransform: "none" }}
                    fontSize="1.4rem"
                    color="white"
                    fontWeight={400}
                  >
                    Prediction
                  </Th>
                  <Th
                    sx={{ textTransform: "none" }}
                    fontSize="1.4rem"
                    color="white"
                    fontWeight={400}
                  >
                    Amount
                  </Th>
                  <Th
                    sx={{ textTransform: "none" }}
                    fontSize="1.4rem"
                    color="white"
                    fontWeight={400}
                  >
                    Public Key
                  </Th>
                  <Th
                    sx={{ textTransform: "none" }}
                    fontSize="1.4rem"
                    color="white"
                    fontWeight={400}
                  >
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {expenses && expenses.length ? (
                  expenses.map((expense: Expense) => (
                    <Tr
                      key={expense.pubKey}
                      fontSize="1.4rem"
                      color="white"
                      fontWeight={500}
                    >
                      <Td>{expense.merchant}</Td>
                      <Td>{expense.prediction}</Td> {/* Display prediction */}
                      <Td>${expense.amount}</Td>
                      <Td>{truncatedPublicKey(expense.pubKey)}</Td>
                      <Td>
                        {/* <IconButton
                          h="2rem"
                          w="2rem"
                          mr="10px"
                          icon={
                            <EditIcon
                              style={{ width: "1.5rem", height: "1.5rem" }}
                            />
                          }
                          aria-label="Update Expense"
                          onClick={() => handleUpdate(expense)}
                        /> */}
                        <Center>
                          <IconButton
                            h="2rem"
                            w="2rem"
                            bg="red.100"
                            icon={
                              <DeleteIcon
                                style={{ width: "1.5rem", height: "1.5rem" }}
                                color="red"
                              />
                            }
                            aria-label="Remove expense"
                            onClick={async () => await handleRemove(expense.id)}
                          />
                        </Center>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Text fontSize="1.5rem" color="gray.500">
                    Nothing to show here
                  </Text>
                )}
              </Tbody>
            </Table>

            <AddItem
              onClose={onClose}
              isOpen={isOpen}
              setExpenses={setExpenses}
              images={images}
            />
            {currentValues && (
              <UpdateItem
                onClose={onClose2}
                isOpen={isOpen2}
                setExpenses={setExpenses}
                currentValues={currentValues}
              />
            )}
          </NoSRR>
        </Box>
      </Flex>
      <DistributionChart data={expenses} />
    </Flex>
  );
};
