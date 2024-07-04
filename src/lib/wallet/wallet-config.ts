import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  trustWallet,
  ledgerWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { optimismSepolia, optimism } from "@wagmi/core/chains";
import { configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import {
  ALCHEMY_PUBLIC_RPC,
  getCurrentNetworkHttpUrl,
} from "../client/constants";

export const { chains, webSocketPublicClient, publicClient } = configureChains(
  [optimismSepolia, optimism],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: getCurrentNetworkHttpUrl(chain.id) || ALCHEMY_PUBLIC_RPC,
      }),
    }),
  ],
);

const connectorArgs = {
  appName: "Swaplace dApp",
  chains: [optimismSepolia, optimism],
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "",
};

const connectors = connectorsForWallets([
  {
    groupName: "Which wallet will you use?",
    wallets: [
      injectedWallet(connectorArgs),
      coinbaseWallet(connectorArgs),
      ledgerWallet(connectorArgs),
      trustWallet(connectorArgs),
      walletConnectWallet(connectorArgs),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const getSiweMessageOptions = () => ({
  statement: "Swaplace dApp",
});

export interface AccountProps {
  account: {
    address: string;
    balanceDecimals?: number;
    balanceFormatted?: string;
    balanceSymbol?: string;
    displayBalance?: string;
    displayName: string;
    ensAvatar?: string;
    ensName?: string;
    hasPendingTransactions: boolean;
  };
}

export { wagmiConfig, getSiweMessageOptions };
