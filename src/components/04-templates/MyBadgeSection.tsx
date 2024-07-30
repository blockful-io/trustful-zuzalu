import React, { useContext, useEffect, useState } from "react";

import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { optimism } from "viem/chains";
import { useAccount } from "wagmi";

import {
  BadgeCard,
  BadgeStatus,
  TheHeader,
  TheFooterNavbar,
} from "@/components/01-atoms";
import { useNotify } from "@/hooks/useNotify";
import { ZUVILLAGE_SCHEMAS } from "@/lib/client/constants";
import { BADGE_QUERY } from "@/lib/client/schemaQueries";
import { WalletContext } from "@/lib/context/WalletContext";
import { fetchEASData } from "@/lib/service/fetchEASData";

import { type BadgeData } from "../01-atoms/BadgeCard";
import { type Schema } from "../01-atoms/BadgeCard";

interface Attestation {
  decodedDataJson: string;
  timeCreated: number;
  attester: string;
  revoked: boolean;
  id: string;
  recipient: string;
  txid: string;
  schema: Schema;
  refUID: string;
  status: boolean;
}

export const MyBadgeSection: React.FC = () => {
  const { address, chainId } = useAccount();
  const { notifyError } = useNotify();
  const { push } = useRouter();

  const { villagerAttestationCount } = useContext(WalletContext);

  useEffect(() => {
    if (villagerAttestationCount === 0) {
      notifyError({
        title: "You have not checked in",
        message: "Please check-in first.",
      });
      push("/pre-checkin");
    }
  }, [villagerAttestationCount]);

  const [badgeData, setBadgeData] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      fetchData();
    }
  }, [address]);

  const fetchData = async () => {
    setLoading(true);
    const responseAttestBadges: Attestation[] = await handleQuery(
      false,
      null,
      null,
    );
    if (responseAttestBadges) {
      const decodedDataPromises: Promise<BadgeData>[] = responseAttestBadges
        .filter((attestation: Attestation) => attestation.decodedDataJson)
        .map(async (attestation: Attestation) => {
          const parsedJson = JSON.parse(attestation.decodedDataJson);
          let title = parsedJson.find((item: any) => item.name === "title")
            ?.value.value;
          if (!title) {
            title = parsedJson.find((item: any) => item.name === "status")
              ?.value.value;

            if (!title) {
              title = parsedJson.find((item: any) => item.name === "role")
                ?.value.value;
            }
          }
          const comment = parsedJson.find(
            (item: any) => item.name === "comment",
          )?.value.value;
          let badgeStatus = BadgeStatus.PENDING;
          let responseId: string | undefined = undefined;
          const responseAttestResponse: Attestation[] = await handleQuery(
            true,
            attestation.attester,
            attestation.id,
          );
          if (responseAttestResponse.length > 0) {
            responseAttestResponse.sort(
              (a, b) => b.timeCreated - a.timeCreated,
            );
            const lastItem = responseAttestResponse[0];
            const parsedJson = JSON.parse(lastItem.decodedDataJson);
            const status = parsedJson.find(
              (item: any) => item.name === "status",
            )?.value.value;
            const revoked = lastItem.revoked;
            responseId = lastItem.id ?? undefined;
            if (!revoked && !status) {
              badgeStatus = BadgeStatus.REJECTED;
            } else if (!revoked && status) {
              badgeStatus = BadgeStatus.CONFIRMED;
            }
          } else if (
            attestation.schema.id === ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.uid ||
            (attestation.schema.id === ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.uid &&
              !attestation.revoked)
          ) {
            badgeStatus = BadgeStatus.CONFIRMED;
          } else if (
            attestation.schema.id === ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.uid &&
            attestation.revoked
          ) {
            badgeStatus = BadgeStatus.REJECTED;
          }

          return {
            id: attestation.id,
            title,
            comment,
            timeCreated: attestation.timeCreated,
            attester: attestation.attester,
            recipient: attestation.recipient,
            txid: attestation.txid,
            schema: attestation.schema,
            status: badgeStatus,
            revoked: attestation.revoked,
            responseId: responseId,
          };
        });

      const decodedData = await Promise.all(decodedDataPromises);
      setBadgeData(decodedData);
    }

    setLoading(false);
  };

  const handleQuery = async (
    isAttestResponse: boolean,
    recipient: string | null,
    attestation: string | null,
  ) => {
    let queryVariables = {};
    queryVariables = {
      where: {
        OR: [
          {
            schemaId: {
              equals: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
            },
            recipient: {
              equals: address,
            },
          },
          {
            schemaId: {
              equals: ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.uid,
            },
            recipient: {
              equals: address,
            },
          },
          {
            schemaId: {
              equals: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.uid,
            },
            recipient: {
              equals: address,
            },
          },
        ],
      },
      orderBy: [
        {
          timeCreated: "desc",
        },
      ],
    };
    if (isAttestResponse) {
      queryVariables = {
        where: {
          schemaId: {
            equals: ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.uid,
          },
          recipient: {
            equals: recipient,
          },
          refUID: {
            equals: attestation,
          },
        },
        orderBy: [
          {
            timeCreated: "desc",
          },
        ],
      };
    }

    try {
      const { response } = await fetchEASData(BADGE_QUERY, queryVariables);
      const attestations = response?.data?.data.attestations;
      if (!attestations) {
        notifyError({
          title: "Cannot fetch EAS",
          message: "Subgraph returned error with current query",
        });
        return null;
      }

      return attestations;
    } catch (error) {
      notifyError({
        title: "Cannot fetch EAS",
        message: "Error while fetching Attestation data from Subgraphs",
      });
      return null;
    }
  };

  return (
    <Flex flexDirection="column" minHeight="100vh">
      {villagerAttestationCount !== null ? (
        <>
          <TheHeader />
          <Box
            flex={1}
            as="main"
            className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center"
            marginBottom="60px"
          >
            <Flex flexDirection={"column"} gap={2} className="w-full">
              {loading ? (
                <Box flex={1} className="flex justify-center items-center">
                  <BeatLoader size={8} color="#B1EF42" />
                </Box>
              ) : (
                <BadgeCard badgeData={badgeData} />
              )}
            </Flex>
          </Box>
          <TheFooterNavbar />
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
