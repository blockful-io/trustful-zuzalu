import { getWalletClient, getPublicClient } from "@wagmi/core";
import { encodeFunctionData } from "viem";

import { wagmiConfig } from "@/wagmi";

import { publicClient, walletClient } from "../wallet/client";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function hasRole(
  role: `0x${string}`,
  account: `0x${string}`,
  configurations: ConnetedWalletConfiguration,
) {
  const walletClient2 = await getWalletClient(wagmiConfig);
  console.log("walletClient2", walletClient2);

  const publicClient2 = getPublicClient(wagmiConfig);
  console.log("publicClient2", publicClient2);

  // refactor - get the ABI from the EAS.sol instead of the resolver.sol
  const encodedData = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: "bytes32", name: "role", type: "bytes32" },
          { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ],

    args: [role, account],
  });

  console.log("encodedData", encodedData);
  console.log("publicClient", publicClient);
  console.log("walletClient", walletClient);

  try {
    const response = await publicClient({
      //TODO: Refactor with correct function
      chainId: configurations.chain,
    }).readContract({
      address: TRUSTFUL_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
      abi: encodedData,
      functionName: "schemas",
      args: [role, account],
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
}
