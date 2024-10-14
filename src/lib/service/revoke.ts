import { getWalletClient } from "@wagmi/core";
import { encodeFunctionData, type TransactionReceipt } from "viem";
import {
  sendTransaction,
  estimateGas,
  waitForTransactionReceipt,
} from "viem/actions";

import { EAS_CONTRACT_SCROLL } from "@/lib/client/constants";
import { publicClient } from "@/lib/wallet/client";
import { wagmiConfig } from "@/wagmi";

export interface RevocationRequestData {
  uid: `0x${string}`;
  value: bigint;
}

export interface RevocationRequest {
  schema: `0x${string}`;
  data: RevocationRequestData;
}

export async function revoke(
  from: `0x${string}`,
  schemaUID: `0x${string}`,
  uid: `0x${string}`,
  value: bigint,
): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(wagmiConfig);
  let gasLimit;

  const revocationRequestData = {
    uid: uid,
    value: value,
  };

  const RevocationRequest: RevocationRequest = {
    schema: schemaUID,
    data: revocationRequestData,
  };

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "schema",
                type: "bytes32",
              },
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "uid",
                    type: "bytes32",
                  },
                  {
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                  },
                ],
                internalType: "struct RevocationRequestData",
                name: "data",
                type: "tuple",
              },
            ],
            internalType: "struct RevocationRequest",
            name: "request",
            type: "tuple",
          },
        ],
        name: "revoke",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    args: [RevocationRequest],
  });

  try {
    gasLimit = estimateGas(publicClient, {
      account: from as `0x${string}`,
      to: EAS_CONTRACT_SCROLL as `0x${string}`,
      data: data,
      value: revocationRequestData.value,
    });
  } catch (error) {
    return Error("Error estimaing gas.");
  }

  try {
    const transactionHash = await sendTransaction(walletClient, {
      account: from as `0x${string}`,
      to: EAS_CONTRACT_SCROLL as `0x${string}`,
      gasLimit: gasLimit,
      data: data,
      value: revocationRequestData.value,
      chain: walletClient.chain,
    });

    const transactionReceipt: TransactionReceipt =
      await waitForTransactionReceipt(publicClient, {
        hash: transactionHash,
      });

    return transactionReceipt;
  } catch (error) {
    return Error("Error sending transaction");
  }
}
