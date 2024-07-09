import { encodeFunctionData } from "viem";

import { TRUSTFUL_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function setAttestationTitle(
  title: string,
  isValid: boolean,
  configurations: ConnetedWalletConfiguration,
  msgValue: bigint,
): Promise<string> {
  const data = encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "setAttestationTitle",
        inputs: [
          { name: "title", type: "string", internalType: "string" },
          { name: "isValid", type: "bool", internalType: "bool" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    args: [title, isValid],
  });

  try {
    const gasLimit = await publicClient({
      chainId: configurations.chain,
    }).estimateGas({
      account: configurations.walletClient.account as `0x${string}`,
      data: data,
      to: TRUSTFUL_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
      value: msgValue,
    });

    const transactionHash = await configurations.walletClient.sendTransaction({
      data: data,
      to: TRUSTFUL_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
      gasLimit: gasLimit,
      value: msgValue,
    });

    const transactionReceipt = await publicClient({
      chainId: configurations.chain,
    }).waitForTransactionReceipt({
      hash: transactionHash,
    });

    return transactionReceipt;
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
}
