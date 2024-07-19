import Head from "next/head";

export const DefaultHead = () => {
  return (
    <Head>
      <title>Shaker Expense Tracker</title>
      <meta name="description" content="Shaker Solana Dapp" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
