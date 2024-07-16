/* eslint-disable react/jsx-no-undef */
import {
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Divider,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import {
  BadgeStatus,
  BadgeTagIcon,
  CalendarIcon,
  HeartIcon,
} from "@/components/01-atoms";
import { useBadge } from "@/lib/context/BadgeContext";

import { EnsAvatar, EnsName } from "../02-molecules";

export interface Schema {
  index: string;
  id: string;
}

export interface BadgeData {
  id: string;
  title: string;
  status: BadgeStatus;
  comment?: string;
  timeCreated: number;
  attester: string;
  recipient: string;
  txid: string;
  schema: Schema;
  revoked: boolean;
  responseId?: string;
}

interface BadgeCardProps {
  badgeData: BadgeData[];
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badgeData }) => {
  const router = useRouter();
  const { setSelectedBadge } = useBadge();

  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
    >
      {badgeData.map((badge) => (
        <Card
          key={badge.id}
          className="cursor-pointer"
          background={"#F5FFFF0D"}
          border={2}
          onClick={() => {
            setSelectedBadge(badge);
            router.push(`my-badge-details`);
          }}
        >
          <CardHeader
            gap={4}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            pt="0.75rem"
            pb="0.75rem"
          >
            <Flex gap={4} className={"items-center"}>
              <Box
                boxSize="16px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <HeartIcon className="w-4 h-4 opacity-50 text-slate-50" />
              </Box>
              <Text fontSize="md" className="text-slate-50">
                {badge.title}
              </Text>
            </Flex>
            <Flex className={"items-center"} gap={2}>
              <BadgeTagIcon status={badge.status} />
            </Flex>
          </CardHeader>
          <Divider color={"#F5FFFF14"} />
          <CardBody gap={4} display={"flex"} flexDirection={"column"}>
            <Flex gap={4} alignItems={"center"} flexDirection={"row"}>
              <CalendarIcon className="w-4 h-4" />
              <Flex gap={2} alignItems={"center"}>
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                  Date
                </Text>
                <Text className="text-slate-50 opacity-70 text-sm font-normal ">
                  {new Date(badge.timeCreated * 1000).toLocaleString()}
                </Text>
              </Flex>
            </Flex>
            <Flex gap={4} alignItems={"center"} flexDirection={"row"}>
              <EnsAvatar
                size={"xxs"}
                ensAddress={badge.attester as `0x${string}`}
              />
              <Flex gap={2} alignItems={"center"}>
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                  Issuer
                </Text>
                <EnsName ensAddress={badge.attester as `0x${string}`} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};
