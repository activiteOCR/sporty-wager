import * as anchor from "@project-serum/anchor";
import { anchorProgram } from "@/util/anchorProgram";

export const getExpenses = async (wallet: anchor.Wallet) => {
  const program = anchorProgram(wallet);

  const expenses = await program.account.expenseAccount.all([
    {
      memcmp: {
        offset: 16, // offset to filter by owner's public key
        bytes: wallet.publicKey.toBase58(),
      },
    },
  ]);

  const output = expenses.map((expense: any) => {
    return {
      merchant: expense.account.merchantName,
      amount: expense.account.amount.toNumber(),
      id: expense.account.id.toNumber(),
      pubKey: expense.publicKey.toBase58(),
      prediction: expense.account.prediction, // Include prediction in the output
    };
  });

  return output;
};
