import { encodeFunctionData } from "viem";

import { EAS_CONTRACT_OP } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function allowedAttestationTitles(
  attestationTitle: string,
  configurations: ConnetedWalletConfiguration,
): Promise<boolean> {
  const data = encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "allowedAttestationTitles",
        inputs: [{ name: "title", type: "string", internalType: "string" }],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
    ],
    args: [attestationTitle],
  });

  try {
    const response = await publicClient({
      chainId: configurations.chain,
    }).readContract({
      address: EAS_CONTRACT_OP[configurations.chain] as `0x${string}`,
      abi: data,
      functionName: "allowedAttestationTitles",
      args: [attestationTitle],
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
}
