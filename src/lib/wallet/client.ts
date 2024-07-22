import { createPublicClient, createWalletClient } from "viem";
import { http } from "viem";
import { optimism } from "viem/chains";
import { mainnet } from "viem/chains";

const mainnetRpcUrl = process.env.ALCHEMY_RPC_URL;
if (!mainnetRpcUrl) {
  throw new Error(
    "Mainnet RPC URL is not defined. Please check your environment variables.",
  );
}

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: optimism,
  transport: http(),
});

export const publicClientMainnet = createPublicClient({
  chain: mainnet,
  transport: http(mainnetRpcUrl),
});
