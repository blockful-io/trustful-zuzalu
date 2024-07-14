import { readContract } from "viem/actions";

import { RESOLVER_CONTRACT_OP } from "../client/constants";
import { publicClient } from "../wallet/client";

export async function getAllAttestationTitles(): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        inputs: [],
        name: "getAllAttestationTitles",
        outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
        stateMutability: "view",
        type: "function",
      },
    ],
  };

  try {
    const response = await readContract(publicClient, {
      address: RESOLVER_CONTRACT_OP as `0x${string}`,
      functionName: "getAllAttestationTitles",
      abi: data.abi,
      args: [],
    });

    if (response === typeof Boolean) return Error("Response should be boolean");

    return response as boolean;
  } catch (error) {
    return Error("Error when reading the contract");
  }
}
