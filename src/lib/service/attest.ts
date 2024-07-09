import { getWalletClient, getPublicClient } from "@wagmi/core";
import { encodeFunctionData } from "viem";
import {
  sendTransaction,
  estimateGas,
  waitForTransactionReceipt,
} from "viem/actions";

import { wagmiConfig } from "@/wagmi";

import { publicClient, walletClient } from "../wallet/client";

export async function submitAttest(
  schema: `0x${string}`,
  recipient: `0x${string}`,
  expirationTime: bigint,
  revocable: boolean,
  refUID: `0x${string}`,
  data: `0x${string}`,
  value: bigint,
  // walletClient: any,x
) {
  const walletClient2 = await getWalletClient(wagmiConfig);
  console.log("walletClient2", walletClient2);

  const publicClient2 = getPublicClient(wagmiConfig);
  console.log("publicClient2", publicClient2);

  const AttestationRequestData = {
    recipient: recipient,
    expirationTime: expirationTime,
    revocable: revocable,
    refUID: refUID,
    data: data,
    value: value,
  };

  const AttestationRequest = {
    schema: schema,
    data: AttestationRequestData,
  };

  // refactor - get the ABI from the EAS.sol instead of the resolver.sol
  const encodedData = encodeFunctionData({
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

  console.log("encodedData", encodedData);
  console.log("value", value);
  console.log("publicClient", publicClient);
  console.log("walletClient", walletClient);

  try {
    const gasLimit = estimateGas(publicClient, {
      account: "0x07231e0fd9F668d4aaFaE7A5D5f432B8E6e4Fe51",
      data: encodedData,
      to: "0x4200000000000000000000000000000000000021",
      value: value,
    })
      .then((gasLimit: any) => console.log("gasLimit", gasLimit))
      .catch((error: any) => console.error("gasLimit,", error));

    const transactionHash = await sendTransaction(walletClient2, {
      data: encodedData,
      account: "0x07231e0fd9F668d4aaFaE7A5D5f432B8E6e4Fe51",
      to: "0x4200000000000000000000000000000000000021",
      gasLimit: gasLimit,
      value: value,
      chain: walletClient.chain,
    });

    const transactionReceipt = await waitForTransactionReceipt(publicClient, {
      hash: transactionHash,
    });

    return transactionReceipt;
  } catch (error) {
    alert("error submitting attestation request");
    console.error(error);
    throw new Error(String(error));
  }
}
