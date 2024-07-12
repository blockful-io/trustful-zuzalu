/* eslint-disable @typescript-eslint/no-explicit-any */
import { readContract } from "viem/actions";

import { TRUSTFUL_CONTRACT_ADDRESSES } from "../client/constants";
import { publicClient } from "../wallet/client";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function allowedAttestationTitles(
  attestationTitle: string,
  configurations: ConnetedWalletConfiguration,
): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        type: "function",
        name: "allowedAttestationTitles",
        inputs: [{ name: "title", type: "string", internalType: "string" }],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
    ],
  };

  try {
    const response = await readContract(publicClient, {
      address: TRUSTFUL_CONTRACT_ADDRESSES[
        configurations.chain
      ] as `0x${string}`,
      abi: data.abi,
      functionName: "allowedAttestationTitles",
      args: [attestationTitle],
    });

    if (response === typeof Boolean) return Error("Response should be boolean");

    return response as boolean;
  } catch (error) {
    return Error("Error when reading the contract");
  }
}
