import React, { useContext, useEffect, useState } from "react";

import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
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

interface Schema {
  index: string;
  id: string;
}

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
}

interface BadgeData {
  id: string;
  title: string;
  status: BadgeStatus;
  comment: string;
  timeCreated: number;
  attester: string;
  recipient: string;
  txid: string;
  schema: Schema;
  revoked: boolean;
}

export const MyBadgeSection: React.FC = () => {
  const { address } = useAccount();
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
    const response: Attestation[] = await handleQuery();
    if (response) {
      // Mapa de refUIDs para status
      const responseDataMap: {
        [key: string]: {
          status: boolean | undefined;
          revoked: boolean | undefined;
        };
      } = response.reduce(
        (
          map: {
            [key: string]: {
              status: boolean | undefined;
              revoked: boolean | undefined;
            };
          },
          attestation: Attestation,
        ) => {
          if (
            attestation.schema.id === ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.uid &&
            attestation.decodedDataJson
          ) {
            const parsedJson = JSON.parse(attestation.decodedDataJson);
            const status = parsedJson.find(
              (item: any) => item.name === "status",
            )?.value.value;
            const revoked = attestation.revoked;
            if (typeof status === "boolean" && typeof revoked === "boolean") {
              map[attestation.refUID] = { status, revoked };
            }
          }
          return map;
        },
        {},
      );
      console.log(responseDataMap);
      const decodedData: BadgeData[] = response
        .filter(
          (attestation: Attestation) =>
            attestation.decodedDataJson &&
            attestation.schema.id !== ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.uid,
        )
        .map((attestation: Attestation) => {
          let badgeStatus: BadgeStatus;
          const responseStatus = responseDataMap[attestation.id].status;
          const responseRevoked = responseDataMap[attestation.id].revoked;
          if (responseStatus === false && responseRevoked === false) {
            badgeStatus = BadgeStatus.REJECTED;
          } else if (responseStatus === true && responseRevoked === false) {
            badgeStatus = BadgeStatus.CONFIRMED;
          } else {
            badgeStatus = BadgeStatus.PENDING;
          }

          const parsedJson = JSON.parse(attestation.decodedDataJson);
          let title = parsedJson.find((item: any) => item.name === "title")
            ?.value.value;
          if (!title) {
            title = parsedJson.find((item: any) => item.name === "status")
              ?.value.value;
              if (attestation.schema.id !== ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.uid){
                badgeStatus = BadgeStatus.CONFIRMED;
              }
            
            if (!title) {
              title = parsedJson.find((item: any) => item.name === "role")
                ?.value.value;
            }
          }
          const comment = parsedJson.find(
            (item: any) => item.name === "comment",
          )?.value.value;

       

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
          };
        });

      setBadgeData(decodedData);
    }
    setLoading(false);
  };

  const handleQuery = async () => {
    const queryVariables = {
      where: {
        OR: [
          {
            schemaId: {
              equals: ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.uid,
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
          {
            schemaId: {
              equals: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
            },
            recipient: {
              equals: address,
            },
          },
        ],
      },
      orderBy: {
        timeCreated: "desc",
      },
    };

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
      console.error("Error in handleQuery:", error);
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
