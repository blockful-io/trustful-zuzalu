import { createPublicClient, createWalletClient } from "viem";
import { optimism } from "viem/chains";
import { http } from "wagmi";

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: optimism,
  transport: http(),
});
