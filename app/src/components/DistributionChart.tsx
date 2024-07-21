import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { Expense } from "@/types/expense";
import { Flex, Text } from "@chakra-ui/react";

type Props = {
  data?: { merchant: string; amount: number }[];
};
export const DistributionChart = ({ data }: Props) => {
  if (!data) {
    data = [{ merchant: "None", amount: 1 }];
  }
  const merchants: string[] = [];
  const amounts: number[] = [];

  data.forEach((expense) => {
    const merchantIndex = merchants.indexOf(expense.merchant);
    if (merchantIndex === -1) {
      merchants.push(expense.merchant);
      amounts.push(expense.amount);
    } else {
      amounts[merchantIndex] += expense.amount;
    }
  });

  const dataEntry = {
    labels: merchants,
    datasets: [
      {
        data: amounts,
        backgroundColor: [
          "#00FFA3",
          "#03E1FF",
          "#DC1FFF",
          "#000000",
          "#FF2DF7",
        ],
        // hoverBackgroundColor: "#7eb7ff"
      },
    ],
  };

  return (
    <Flex flexFlow="column" align="center" w="23%">
      <Text color="white" fontSize="1.3rem">
        Wager distribution
      </Text>
      <Doughnut data={dataEntry} width={400} height={400} />
    </Flex>
  );
};
