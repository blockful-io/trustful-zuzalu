import { encodeFunctionData } from "viem";
import { TRUSTFUL_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function submitAttest(
  uid: `0x${string}`,
  schema: `0x${string}`,
  time: bigint,
  expirationTime: bigint,
  refUID: `0x${string}`,
  recipient: `0x${string}`,
  attester: `0x${string}`,
  revocable: boolean,
  data: `0x${string}`,
  configurations: ConnetedWalletConfiguration,
  msgValue: bigint,
) {
  const attestation = {
    uid,
    schema,
    time,
    expirationTime,
    revocationTime: 0n,
    refUID,
    recipient,
    attester,
    revocable,
    data,
  };

  const encodedData = encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "attest",
        inputs: [
          {
            name: "attestation",
            type: "tuple",
            internalType: "struct Attestation",
            components: [
              { name: "uid", type: "bytes32", internalType: "bytes32" },
              { name: "schema", type: "bytes32", internalType: "bytes32" },
              { name: "time", type: "uint64", internalType: "uint64" },
              {
                name: "expirationTime",
                type: "uint64",
                internalType: "uint64",
              },
              {
                name: "revocationTime",
                type: "uint64",
                internalType: "uint64",
              },
              { name: "refUID", type: "bytes32", internalType: "bytes32" },
              { name: "recipient", type: "address", internalType: "address" },
              { name: "attester", type: "address", internalType: "address" },
              { name: "revocable", type: "bool", internalType: "bool" },
              { name: "data", type: "bytes", internalType: "bytes" },
            ],
          },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "payable",
      },
    ],

    args: [attestation],
  });

  try {
    const gasLimit = await publicClient({
      chainId: configurations.chain,
    }).estimateGas({
      account: configurations.walletClient.account as `0x${string}`,
      data: encodedData,
      to: TRUSTFUL_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
      value: msgValue,
    });

    const transactionHash = await configurations.walletClient.sendTransaction({
      data: encodedData,
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
