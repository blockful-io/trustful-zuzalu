import { getWalletClient, getPublicClient } from "@wagmi/core";
import { encodeFunctionData } from "viem";

import { wagmiConfig } from "@/wagmi";

import { publicClient, walletClient } from "../wallet/client";

export async function revoke(
  schema: `0x${string}`,
  uid: `0x${string}`,
  value: bigint,
  data: `0x${string}`,
  // walletClient: any,
) {
  const walletClient2 = await getWalletClient(wagmiConfig);
  console.log("walletClient2", walletClient2);

  const publicClient2 = getPublicClient(wagmiConfig);
  console.log("publicClient2", publicClient2);

  const RevocationRequestData = {
    uid: uid,
    data: data,
    value: value,
  };

  const RevocationRequest = {
    schema: schema,
    data: RevocationRequestData,
  };

  // refactor - get the ABI from the EAS.sol instead of the resolver.sol
  const encodedData = encodeFunctionData({
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
    const gasLimit = await publicClient.estimateGas({
      account: "0x07231e0fd9F668d4aaFaE7A5D5f432B8E6e4Fe51",
      data: encodedData,
      to: "0x4200000000000000000000000000000000000021",
      value: value,
    });

    const transactionHash = await walletClient.sendTransaction({
      data: encodedData,
      account: "0x07231e0fd9F668d4aaFaE7A5D5f432B8E6e4Fe51",
      to: "0x4200000000000000000000000000000000000021",
      gasLimit: gasLimit,
      value: value,
    });

    const transactionReceipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });

    return transactionReceipt;
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
}
