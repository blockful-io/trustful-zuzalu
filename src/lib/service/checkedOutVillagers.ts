import { encodeFunctionData } from "viem";

import { TRUSTFUL_CONTRACT_ADDRESSES } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function checkedOutVillagers(
  villagerAddress: `0x${string}`,
  configurations: ConnetedWalletConfiguration,
): Promise<boolean> {
  const data = encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "checkedOutVillagers",
        inputs: [
          { name: "villager", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
    ],
    args: [villagerAddress],
  });

  try {
    const response = await publicClient({
      chainId: configurations.chain,
    }).readContract({
      address: TRUSTFUL_CONTRACT_ADDRESSES[
        configurations.chain
      ] as `0x${string}`,
      abi: data,
      functionName: "checkedOutVillagers",
      args: [villagerAddress],
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
}
