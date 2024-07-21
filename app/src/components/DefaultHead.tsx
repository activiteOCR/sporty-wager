import Head from "next/head";

export const DefaultHead = () => {
  return (
    <Head>
      <title>Sporty Wager</title>
      <meta name="description" content="Sporty Wager" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
