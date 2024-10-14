import { getWalletClient } from "@wagmi/core";
import { encodeFunctionData, type TransactionReceipt } from "viem";
import {
  sendTransaction,
  estimateGas,
  waitForTransactionReceipt,
} from "viem/actions";

import { wagmiConfig } from "@/wagmi";

import { EAS_CONTRACT_SCROLL } from "../client/constants";
import { publicClient } from "../wallet/client";

export interface AttestationRequestData {
  recipient: `0x${string}`;
  expirationTime: bigint;
  revocable: boolean;
  refUID: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
}

export interface AttestationRequest {
  schema: `0x${string}`;
  data: AttestationRequestData;
}

export async function submitAttest(
  from: `0x${string}`,
  schemaUID: `0x${string}`,
  attestationRequestData: AttestationRequestData,
): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(wagmiConfig);
  let gasLimit;

  const AttestationRequest: AttestationRequest = {
    schema: schemaUID,
    data: attestationRequestData,
  };

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          {
            components: [
              { internalType: "bytes32", name: "schema", type: "bytes32" },
              {
                components: [
                  {
                    internalType: "address",
                    name: "recipient",
                    type: "address",
                  },
                  {
                    internalType: "uint64",
                    name: "expirationTime",
                    type: "uint64",
                  },
                  { internalType: "bool", name: "revocable", type: "bool" },
                  { internalType: "bytes32", name: "refUID", type: "bytes32" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                internalType: "struct AttestationRequestData",
                name: "data",
                type: "tuple",
              },
            ],
            internalType: "struct AttestationRequest",
            name: "request",
            type: "tuple",
          },
        ],
        name: "attest",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "payable",
        type: "function",
      },
    ],

    args: [AttestationRequest],
  });

  try {
    gasLimit = await estimateGas(publicClient, {
      account: from as `0x${string}`,
      to: EAS_CONTRACT_SCROLL as `0x${string}`,
      data: data,
      value: attestationRequestData.value,
    });
  } catch (error) {
    return Error("Error estimating gas.");
  }

  try {
    const transactionHash = await sendTransaction(walletClient, {
      account: from as `0x${string}`,
      to: EAS_CONTRACT_SCROLL as `0x${string}`,
      gasLimit: gasLimit,
      data: data,
      value: attestationRequestData.value,
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
