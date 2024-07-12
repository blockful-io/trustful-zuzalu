import { encodeFunctionData } from "viem";

import { EAS_CONTRACT_OP } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function revoke(
  schema: `0x${string}`,
  uid: `0x${string}`,
  value: bigint,
  data: `0x${string}`,
  configurations: ConnetedWalletConfiguration,
) {
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
    const gasLimit = await publicClient({
      chainId: configurations.chain,
    }).estimateGas({
      account: configurations.walletClient.account as `0x${string}`,
      data: encodedData,
      to: EAS_CONTRACT_OP[configurations.chain] as `0x${string}`,
      value: value,
    });

    const transactionHash = await configurations.walletClient.sendTransaction({
      data: encodedData,
      to: EAS_CONTRACT_OP[configurations.chain] as `0x${string}`,
      gasLimit: gasLimit,
      value: value,
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
