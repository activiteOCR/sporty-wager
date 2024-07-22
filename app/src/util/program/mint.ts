import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  bundlrStorage,
  NftWithToken,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { WalletContextState } from "@solana/wallet-adapter-react";

const preconfiguredUri =
  "https://arweave.net/wR2b3JIU7i9A3WLEJ9zZ2hJiTJ2oUqKK6WimocSeaNE";

interface NftData {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
}

// Example data for a new NFT
const nftData: NftData = {
  name: "Your NFT Name",
  symbol: "SYMBOL",
  description: "Your NFT Description",
  sellerFeeBasisPoints: 500, // 5% seller fee
};

// Helper function to create an NFT
async function createNft(
  metaplex: Metaplex,
  uri: string,
  nftData: NftData
): Promise<NftWithToken> {
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri, // Preconfigured metadata URI
      name: nftData.name,
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
      symbol: nftData.symbol,
    },
    { commitment: "finalized" }
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  return nft as NftWithToken;
}

// Main function to create and mint NFT
export const mintNFT = async (wallet: WalletContextState) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  const connection = new Connection(clusterApiUrl("devnet"));

  console.log("PublicKey:", wallet.publicKey.toBase58());

  // Metaplex setup
  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  // Create an NFT using the helper function and the preconfigured URI
  const nft = await createNft(metaplex, preconfiguredUri, nftData);

  console.log("NFT created successfully", nft);
};
