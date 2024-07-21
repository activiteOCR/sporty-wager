import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { DEVNET_RPC } from "./constants";
import { AnchorWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { getQuote } from "./jupiter.helper";
import bs58 from "bs58";

export const truncatedPublicKey = (publicKey: string, length?: number) => {
  if (!publicKey) return;
  if (!length) {
    length = 5;
  }
  return publicKey.replace(publicKey.slice(length, 44 - length), "...");
};

const connection = new Connection(DEVNET_RPC!, "confirmed");

export async function getSolanaBalance(publicKey: string): Promise<number> {
  const balanceInLamports = await connection.getBalance(
    new PublicKey(publicKey)
  );
  const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;

  return balanceInSol;
}

export async function instructionDataToTransactionInstruction(
  instructionPayload: any
) {
  if (!instructionPayload) {
    return null;
  }

  return new TransactionInstruction({
    programId: new PublicKey(instructionPayload.programId),
    keys: instructionPayload.accounts.map((key: any) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instructionPayload.data, "base64"),
  });
}

export async function getSwapIxs(
  wallet: PublicKey,
  amount: number,
  mint: string,
  outputMint: string,
  destinationTokenAccount: string = "",
  slippage: string = "0.5"
) {
  const quoteResponse: any = await getQuote(amount, mint, outputMint, slippage);

  let swapParams: any = {
    quoteResponse,
    userPublicKey: wallet.toString(),
    wrapAndUnwrapSol: true,
    prioritzationFeeLamports: 1_000_000,
  };

  if (destinationTokenAccount.length > 0) {
    swapParams["destinationTokenAccount"] = destinationTokenAccount;
  }

  const swapIx: any = await (
    await fetch("https://quote-api.jup.ag/v6/swap-instructions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(swapParams),
    })
  ).json();

  const instructions: any = [];

  console.log("swapIx", swapIx);

  if (swapIx.computeBudgetInstructions) {
    for (let i = 0; i < swapIx.computeBudgetInstructions.length; i++) {
      instructions.push(
        await instructionDataToTransactionInstruction(
          swapIx.computeBudgetInstructions[i]
        )
      );
    }
  }

  for (let i = 0; i < swapIx?.setupInstructions?.length; i++) {
    instructions.push(
      await instructionDataToTransactionInstruction(swapIx.setupInstructions[i])
    );
  }

  instructions.push(
    await instructionDataToTransactionInstruction(swapIx.swapInstruction)
  );

  if (swapIx.cleanupInstruction) {
    instructions.push(
      await instructionDataToTransactionInstruction(swapIx.cleanupInstruction)
    );
  }

  return {
    instructions,
    addressLookupTableAddresses: swapIx.addressLookupTableAddresses,
    swappedAmount: quoteResponse.outAmount,
  };
}

export const getAddressLookupTableAccounts = async (
  keys: string[],
  connection: any
): Promise<AddressLookupTableAccount[]> => {
  const addressLookupTableAccountInfos =
    await connection.getMultipleAccountsInfo(
      keys.map((key) => new PublicKey(key))
    );

  return addressLookupTableAccountInfos.reduce(
    (acc: any, accountInfo: any, index: any) => {
      const addressLookupTableAddress = keys[index];
      if (accountInfo) {
        const addressLookupTableAccount = new AddressLookupTableAccount({
          key: new PublicKey(addressLookupTableAddress),
          state: AddressLookupTableAccount.deserialize(accountInfo.data),
        });
        acc.push(addressLookupTableAccount);
      }

      return acc;
    },
    new Array<AddressLookupTableAccount>()
  );
};

export const jitoTipWallets: string[] = [
  "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
  "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
  "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
  "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
  "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
  "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
  "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
  "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
];

export const getJitoTipWallet = () => {
  // return random tip wallet from JitoTipWallets
  return jitoTipWallets[Math.floor(Math.random() * jitoTipWallets.length)];
};

export const createSwapTransaction = async (
  addressLookupTableAddresses: any,
  payer: PublicKey,
  swapIx: TransactionInstruction[]
): Promise<VersionedTransaction | null> => {
  const addressLookupTableAccounts = addressLookupTableAddresses
    ? await getAddressLookupTableAccounts(
        addressLookupTableAddresses,
        connection
      )
    : [];

  let { blockhash } = await connection.getLatestBlockhash();

  const tipIx = SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: new PublicKey(getJitoTipWallet()),
    lamports: 100_000,
  });

  swapIx.push(tipIx);

  const swapMessageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions: swapIx,
  }).compileToV0Message(addressLookupTableAccounts);

  return new VersionedTransaction(swapMessageV0);
};

export const sendTransaction = async (
  transaction: VersionedTransaction
): Promise<string | null> => {
  const transactionSignature = transaction.signatures[0];
  let txSignature = bs58.encode(transactionSignature);

  try {
    let blockhashResult = await connection.getLatestBlockhash({
      commitment: "confirmed",
    });

    let confirmTransactionPromise;
    let txSendAttempts = 1;
    try {
      confirmTransactionPromise = connection.confirmTransaction(
        {
          signature: txSignature,
          blockhash: blockhashResult.blockhash,
          lastValidBlockHeight: blockhashResult.lastValidBlockHeight,
        },
        "confirmed"
      );

      let confirmedTx = null;
      while (!confirmedTx) {
        confirmedTx = await Promise.race([
          confirmTransactionPromise,
          new Promise((resolve) =>
            setTimeout(() => {
              resolve(null);
            }, 1000)
          ),
        ]);
        if (confirmedTx) {
          break;
        }

        await connection.sendRawTransaction(transaction.serialize(), {
          maxRetries: 0,
        });

        console.log(
          `${new Date().toISOString()} Tx not confirmed after ${
            1000 * txSendAttempts++
          }ms, resending`
        );

        if (txSendAttempts > 60) {
          return null;
        }
      }

      return txSignature;
    } catch (error) {
      console.error(error);
      return txSignature;
    }
  } catch (error) {
    console.error(error);
    return txSignature;
  }
};

export async function sendSwapTransaction(
  wallet: WalletContextState,
  amount: number,
  token1: string,
  token2: string
) {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) return;
    const instructions: TransactionInstruction[] = [];

    const { instructions: swapIx, addressLookupTableAddresses } =
      await getSwapIxs(wallet.publicKey, amount, token1, token2);

    const transaction = await createSwapTransaction(
      addressLookupTableAddresses,
      wallet.publicKey,
      swapIx
    );

    if (!transaction) {
      return null;
    }

    const signedTransaction = await wallet.signTransaction(transaction);

    const signature = await sendTransaction(signedTransaction);

    console.log("signature", signature);
    return signature;
  } catch (error) {
    console.error(error);
    return null;
  }
}
