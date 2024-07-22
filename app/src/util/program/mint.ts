import { Connection, clusterApiUrl, PublicKey, Keypair } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  Nft,
} from "@metaplex-foundation/js";
import dotenv from "dotenv";

dotenv.config();

interface NftData {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
}

// Example data for a new NFT
const nftData = {
  name: "Name",
  symbol: "SYMBOL",
  description: "Description",
  sellerFeeBasisPoints: 0,
};

// Load keypair from environment variable
const loadKeypairFromEnv = (): Keypair => {
  const secretKey = Uint8Array.from(JSON.parse(process.env.KEYPAIR || "[]"));
  return Keypair.fromSecretKey(secretKey);
};

// Upload image and metadata
async function uploadMetadata(
  metaplex: Metaplex,
  nftData: NftData,
  imageFile: File
): Promise<string> {
  const buffer = await imageFile.arrayBuffer();
  const file = toMetaplexFile(buffer, imageFile.name);
  const imageUri = await metaplex.storage().upload(file);
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: nftData.name,
    symbol: nftData.symbol,
    description: nftData.description,
    image: imageUri,
  });
  return uri;
}

// Create NFT
async function createNft(
  metaplex: Metaplex,
  uri: string,
  nftData: NftData
): Promise<Nft> {
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri,
      name: nftData.name,
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
      symbol: nftData.symbol,
    },
    { commitment: "finalized" }
  );
  return nft;
}

// Main function
export const mintNft = async (imageFile: File) => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const user = loadKeypairFromEnv();
  console.log("PublicKey:", user.publicKey.toBase58());

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  const uri = await uploadMetadata(metaplex, nftData, imageFile);
  const nft = await createNft(metaplex, uri, nftData);

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );
};
