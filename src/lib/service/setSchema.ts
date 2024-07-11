// import { encodeFunctionData } from "viem";

// import { TRUSTFUL_CONTRACT_ADDRESSES } from "../client/constants";
// import { Action } from "../shared/types";
// import { publicClient } from "../wallet/wallet-config";

// export interface ConnetedWalletConfiguration {
//   walletClient: any;
//   chain: number;
// }

// export async function setSchema(
//   uid: `0x${string}`,
//   roleId: `0x${string}`,
//   action: Action,
//   configurations: ConnetedWalletConfiguration,
//   msgValue: bigint,
// ): Promise<string> {
//   const actionAsBigInt = BigInt(action);

//   const data = encodeFunctionData({
//     abi: [
//       {
//         type: "function",
//         name: "setSchema",
//         inputs: [
//           { name: "uid", type: "bytes32", internalType: "bytes32" },
//           { name: "roleId", type: "bytes32", internalType: "bytes32" },
//           { name: "action", type: "uint256", internalType: "uint256" },
//         ],
//         outputs: [],
//         stateMutability: "nonpayable",
//       },
//     ],
//     args: [uid, roleId, actionAsBigInt],
//   });

//   try {
//     const gasLimit = await publicClient({
//       chainId: configurations.chain,
//     }).estimateGas({
//       account: configurations.walletClient.account as `0x${string}`,
//       data: data,
//       to: TRUSTFUL_CONTRACT_ADDRESSES[configurations.chain] as `0x${string}`,
//       value: msgValue,
//     });

//     const transactionHash = await configurations.walletClient.sendTransaction({
//       data: data,
//       to: TRUSTFUL_CONTRACT_ADDRESSES[configurations.chain] as `0x${string}`,
//       gasLimit: gasLimit,
//       value: msgValue,
//     });

//     const transactionReceipt = await publicClient({
//       chainId: configurations.chain,
//     }).waitForTransactionReceipt({
//       hash: transactionHash,
//     });

//     return transactionReceipt;
//   } catch (error) {
//     console.error(error);
//     throw new Error(String(error));
//   }
// }
