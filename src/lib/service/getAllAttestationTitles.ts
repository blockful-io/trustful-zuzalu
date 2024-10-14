import { readContract } from "viem/actions";

import { RESOLVER_CONTRACT_SCROLL } from "../client/constants";
import { publicClient } from "../wallet/client";

export async function getAllAttestationTitles(): Promise<string[] | Error> {
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
      address: RESOLVER_CONTRACT_SCROLL as `0x${string}`,
      functionName: "getAllAttestationTitles",
      abi: data.abi,
      args: [],
    });

    return response as string[];
  } catch (error) {
    return Error("Error when reading the contract");
  }
}
