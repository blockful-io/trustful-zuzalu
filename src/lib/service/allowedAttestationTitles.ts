/* eslint-disable @typescript-eslint/no-explicit-any */
import { readContract } from "viem/actions";

import { RESOLVER_CONTRACT_SCROLL } from "../client/constants";
import { publicClient } from "../wallet/client";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function allowedAttestationTitles(
  attestationTitle: string,
): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        inputs: [{ internalType: "string", name: "title", type: "string" }],
        name: "allowedAttestationTitles",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    args: [attestationTitle],
  };

  try {
    const response = await readContract(publicClient, {
      address: RESOLVER_CONTRACT_SCROLL as `0x${string}`,
      functionName: "allowedAttestationTitles",
      abi: data.abi,
      args: [attestationTitle],
    });

    if (response === typeof Boolean) return Error("Response should be boolean");

    return response as boolean;
  } catch (error) {
    return Error("Error when reading the contract");
  }
}
