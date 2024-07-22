import { createPublicClient, createWalletClient } from "viem";
import { http } from "viem";
import { optimism } from "viem/chains";
import { mainnet } from "viem/chains";

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
  transport: http(),
});
