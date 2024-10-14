import { getWalletClient } from "@wagmi/core";
import { encodeFunctionData, type TransactionReceipt } from "viem";
import {
  sendTransaction,
  estimateGas,
  waitForTransactionReceipt,
} from "viem/actions";

import { RESOLVER_CONTRACT_SCROLL } from "@/lib/client/constants";
import { publicClient } from "@/lib/wallet/client";
import { wagmiConfig } from "@/wagmi";

export async function setAttestationTitle({
  from,
  title,
  isValid,
  value,
}: {
  from: `0x${string}`;
  title: string;
  isValid: boolean;
  value: bigint;
}): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(wagmiConfig);
  let gasLimit;

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "bool", name: "isValid", type: "bool" },
        ],
        name: "setAttestationTitle",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [title, isValid],
  });

  try {
    gasLimit = estimateGas(publicClient, {
      account: from as `0x${string}`,
      to: RESOLVER_CONTRACT_SCROLL as `0x${string}`,
      data: data,
      value: value,
    });
  } catch (error) {
    return Error("Error estimating gas.");
  }

  try {
    const transactionHash = await sendTransaction(walletClient, {
      account: from as `0x${string}`,
      to: RESOLVER_CONTRACT_SCROLL as `0x${string}`,
      gasLimit: gasLimit,
      data: data,
      value: value,
      chain: walletClient.chain,
    });

    const transactionReceipt: TransactionReceipt =
      await waitForTransactionReceipt(publicClient, {
        hash: transactionHash,
      });

    return transactionReceipt;
  } catch (error) {
    return Error("Error sending transaction.");
  }
}
