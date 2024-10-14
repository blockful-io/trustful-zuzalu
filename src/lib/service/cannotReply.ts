import { readContract } from "viem/actions";

import { RESOLVER_CONTRACT_SCROLL } from "../client/constants";
import { publicClient } from "../wallet/client";

export async function cannotReply(
  uid: `0x${string}`,
): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        inputs: [{ internalType: "bytes32", name: "uid", type: "bytes32" }],
        name: "cannotReply",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ],
  };

  try {
    const response = await readContract(publicClient, {
      address: RESOLVER_CONTRACT_SCROLL as `0x${string}`,
      functionName: "cannotReply",
      abi: data.abi,
      args: [uid],
    });

    if (response === typeof Boolean) return Error("Response should be boolean");

    return response as boolean;
  } catch (error) {
    return Error("Error when reading the contract");
  }
}
