"use client";

import { HomeSection } from "@/components/04-templates";
import { BadgeDetailsSection } from "@/components/04-templates/BadgeDetailsSection";
import { CheckoutSection } from "@/components/04-templates/CheckoutSection";
import { GiveBadgeSection } from "@/components/04-templates/GiveBadgeSection";
import { MyBadgeSection } from "@/components/04-templates/MyBadgeSection";
import { PreCheckinSection } from "@/components/04-templates/PreCheckinSection";

export default function renderPage({
  params,
}: {
  params: { slug: string; id: number };
}) {
  switch (params.slug) {
    case "pre-checkin":
      return <PreCheckinSection />;
    case "my-badge":
      return <MyBadgeSection />;
    case "my-badge-1": // TO DO: replace with dynamic id
      return <BadgeDetailsSection />;
    case "give-badge":
      return <GiveBadgeSection />;
    // case "give-badge-address": // TO DO: replace with /give-badge/address
    //   return <GiveBadgeSection />;
    case "check-out":
      return <CheckoutSection />;
    default:
      return <HomeSection />;
  }
}
