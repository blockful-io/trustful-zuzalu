/* eslint-disable react/jsx-no-undef */
import {
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Divider,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import {
  ArrowIcon,
  ArrowIconVariant,
  BadgeStatus,
  BadgeTagIcon,
  CalendarIcon,
  HeartIcon,
} from "@/components/01-atoms";
import { getEllipsedAddress } from "@/utils/formatters";

interface BadgeData {
  id: string;
  title: string;
  status: string;
  comment: string;
  timeCreated: number;
  attester: string;
}

interface BadgeCardProps {
  badgeData: BadgeData[];
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badgeData }) => {
  const router = useRouter();
  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(255px, 1fr))"
    >
      {badgeData.map((badge) => (
        <Card
          key={badge.id}
          className="cursor-pointer"
          background={"#F5FFFF0D"}
          border={2}
          onClick={() => {
            router.push(`my-badge-details`); //TODO: Replace with dynamic route ID
            console.log("Card Clicked go to Details of this Card");
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
              <HeartIcon className="w-4 h-4 opacity-50 text-slate-50" />
              <Text fontSize="md" className="text-slate-50">
                {badge.title}
              </Text>
            </Flex>
            <Flex className={"items-center"} gap={2}>
              <BadgeTagIcon status={BadgeStatus.PENDING} />
              <ArrowIcon variant={ArrowIconVariant.RIGHT} />
            </Flex>
          </CardHeader>
          <Divider color={"#F5FFFF14"} />
          <CardBody gap={4} display={"flex"} flexDirection={"column"}>
            <Flex gap={4} alignItems={"center"} flexDirection={"row"}>
              <CalendarIcon className="w-5 h-5 " />
              <Flex gap={2} alignItems={"center"}>
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                  Date
                </Text>
                <Text className="text-slate-50 text-sm font-normal ">
                  {new Date(badge.timeCreated * 1000).toLocaleString()}
                </Text>
              </Flex>
            </Flex>
            <Flex gap={4} alignItems={"center"} flexDirection={"row"}>
              <Avatar className="w-5 h-5" />
              <Flex gap={2} alignItems={"center"}>
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                  Issued by
                </Text>
                <Text className="text-slate-50 text-sm font-normal ">
                  {getEllipsedAddress(badge.attester as `0x${string}`)}
                </Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};
