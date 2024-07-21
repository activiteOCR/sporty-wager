import { createExpense } from "@/util/program/createExpense";
import { getExpenses } from "@/util/program/getExpenses";
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  useToast,
  Select,
} from "@chakra-ui/react";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";

interface AddItemProps {
  isOpen: boolean;
  onClose: any;
  setExpenses: any;
  images: { src: string; title: string; description: string }[];
}

export const AddItem = ({
  isOpen,
  onClose,
  setExpenses,
  images,
}: AddItemProps) => {
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [prediction, setPrediction] = useState<string>(""); // New state for prediction
  const wallet = useAnchorWallet();
  const toast = useToast();

  const onSubmit = async () => {
    if (!wallet) {
      toast({
        status: "error",
        title: "Connect Wallet Required",
      });
      return;
    }

    const { sig, error } = await createExpense(
      wallet as NodeWallet,
      selectedTitle,
      amount,
      prediction // Include prediction in the transaction
    );

    if (!sig || error) {
      toast({
        status: "error",
        title: error,
      });
      return;
    }

    console.log("Add sig: ", sig);

    toast({
      status: "success",
      title: "Signature: " + sig,
    });

    const data = await getExpenses(wallet as NodeWallet);
    setExpenses(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="black" color="white">
        <ModalHeader>Add new prediction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Title</FormLabel>
            <Select
              placeholder="Select title"
              onChange={(e) => setSelectedTitle(e.target.value)}
              bg="gray.700"
              color="white"
              borderColor="gray.600"
              _hover={{ bg: "gray.600" }}
              _focus={{ bg: "gray.600" }}
            >
              {images.map((image) => (
                <option
                  key={image.title}
                  value={image.title}
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  {image.title}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Prediction</FormLabel>
            <Select
              placeholder="Select prediction"
              onChange={(e) => setPrediction(e.target.value)}
              bg="gray.700"
              color="white"
              borderColor="gray.600"
              _hover={{ bg: "gray.600" }}
              _focus={{ bg: "gray.600" }}
            >
              <option
                value="Team1 win"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Team1 win
              </option>
              <option
                value="Draw"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Draw
              </option>
              <option
                value="Team2 win"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Team2 win
              </option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Amount</FormLabel>
            <NumberInput
              onChange={(valueString) => setAmount(Number(valueString))}
            >
              <NumberInputField h="3rem" fontSize="1.2rem" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <Button onClick={onSubmit} colorScheme="purple">
            Add Prediction
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
