import { encodeFunctionData } from "viem";

import { EAS_CONTRACT_OP } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function schemas(
  uid: `0x${string}`,
  roleId: `0x${string}`,
  configurations: ConnetedWalletConfiguration,
): Promise<string> {
  const data = encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "schemas",
        inputs: [
          { name: "uid", type: "bytes32", internalType: "bytes32" },
          { name: "roleId", type: "bytes32", internalType: "bytes32" },
        ],
        outputs: [
          { name: "", type: "uint8", internalType: "enum IResolver.Action" },
        ],
        stateMutability: "view",
      },
    ],
    args: [uid, roleId],
  });

  try {
    const response = await publicClient({
      chainId: configurations.chain,
    }).readContract({
      address: EAS_CONTRACT_OP[configurations.chain] as `0x${string}`,
      abi: data,
      functionName: "schemas",
      args: [uid, roleId],
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
}
