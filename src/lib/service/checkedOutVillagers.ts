import { readContract } from "viem/actions";

import { RESOLVER_CONTRACT_OP } from "../client/constants";
import { publicClient } from "../wallet/client";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function checkedOutVillagers(
  villagerAddress: `0x${string}`,
): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        inputs: [
          { internalType: "address", name: "villager", type: "address" },
        ],
        name: "checkedOutVillagers",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    args: [villagerAddress],
  };

  try {
    const response = await readContract(publicClient, {
      address: RESOLVER_CONTRACT_OP as `0x${string}`,
      functionName: "checkedOutVillagers",
      abi: data.abi,
      args: [villagerAddress],
    });

    if (response === typeof Boolean) return Error("Response should be boolean");

    return response as boolean;
  } catch (error) {
    return Error("Error when reading the contract");
  }
}
