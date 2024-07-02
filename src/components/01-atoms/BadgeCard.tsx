/* eslint-disable react/jsx-no-undef */
import {
  SimpleGrid,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Text,
  Divider,
} from "@chakra-ui/react";

import {
  ArrowIcon,
  ArrowIconVariant,
  BadgeStatus,
  BadgeTagIcon,
  HeartIcon,
} from "@/components/01-atoms";

export const BadgeCard = () => {
  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(240px, 1fr))"
    >
      <Card
        background={"#F5FFFF0D"}
        border={2}
        onClick={() => {
          // router.push(`my-badge/${[id]}`);
          console.log("Card Clicked go to Details of this Card");
        }}
      >
        <CardHeader gap={4} display={"flex"} alignItems={"center"}>
          <HeartIcon />
          <Heading size="md">CheckIn</Heading>
          <BadgeTagIcon status={BadgeStatus.CONFIRMED} />
          <ArrowIcon variant={ArrowIconVariant.RIGHT} />
        </CardHeader>
        <Divider color={"#F5FFFF14"} />
        <CardBody>
          <Text>Date Jun 19th - 3:32pm</Text>
          <Text>Issued by Address</Text>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};
