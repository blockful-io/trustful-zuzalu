import { encodeFunctionData } from "viem";
import { TRUSTFUL_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function submitAttest(
  schemaUID: `0x${string}`,
  recipient: `0x${string}`,
  expirationTime: bigint,
  revocable: boolean,
  refUID: `0x${string}`,
  data: `0x${string}`,
  value: bigint,
  configurations: ConnetedWalletConfiguration,
) {
  const AttestationRequestData = {
    recipient: recipient,
    expirationTime: expirationTime,
    revocable: revocable,
    refUID: refUID,
    data: data,
    value: value,
  };

  const AttestationRequest = {
    schema: schemaUID,
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

  try {
    const gasLimit = await publicClient({
      chainId: configurations.chain,
    }).estimateGas({
      account: configurations.walletClient.account as `0x${string}`,
      data: encodedData,
      to: TRUSTFUL_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
      value: value,
    });

    const transactionHash = await configurations.walletClient.sendTransaction({
      data: encodedData,
      to: TRUSTFUL_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
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
