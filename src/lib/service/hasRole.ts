import { readContract } from "viem/actions";

import { RESOLVER_CONTRACT_SCROLL } from "../client/constants";
import { publicClient } from "../wallet/client";

export async function hasRole(
  role: `0x${string}`,
  account: `0x${string}`,
): Promise<boolean | Error> {
  const data = {
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
  };

  try {
    const response = await readContract(publicClient, {
      address: RESOLVER_CONTRACT_SCROLL as `0x${string}`,
      functionName: "hasRole",
      abi: data.abi,
      args: [role, account],
    });

    return response as boolean;
  } catch (error) {
    return Error("Error when reading the contract");
  }
}
