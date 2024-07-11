// components/MainPane.tsx
import { type FC } from "react";

import { Box, Flex, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Space_Grotesk } from "next/font/google";
import { useAccount } from "wagmi";

import { CreatedByBlockful } from "@/components/01-atoms";
import { useWindowSize } from "@/hooks";
import styles from "@/styles/mainPane.module.css";

const grotesk = Space_Grotesk({ subsets: ["latin"] });

export const MainPane: FC = () => {
  const { isConnected } = useAccount();
  const { isMobile } = useWindowSize();

  return (
    <Box className={styles.container}>
      <Flex>
        <Heading
          as="h2"
          className={`${grotesk.className} text-[53px] font-normal leading-[64px]`}
          color="#F5FFFF"
        >
          Online
          <br />
          reputation
          <br />
          made easy
        </Heading>
      </Flex>
      <Flex className={styles.content}>
        {!isConnected && isMobile && (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          style={{
                            background: "#B1EF42",
                            fontSize: "18px",
                            fontWeight: 500,
                            color: "#161617",
                            padding: "13px 28px 13px 28px",
                            borderRadius: "12px",
                            fontFamily: "Onest",
                            lineHeight: "normal",
                            fontStyle: "normal",
                          }}
                          onClick={openConnectModal}
                          type="button"
                        >
                          Connect
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button onClick={openChainModal} type="button">
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                        }}
                      >
                        <button
                          onClick={openChainModal}
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                          type="button"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>

                        <button onClick={openAccountModal} type="button">
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        )}
      </Flex>
      <Flex className="bottom-[5%] absolute mt-auto">
        <CreatedByBlockful />
      </Flex>
    </Box>
  );
};
