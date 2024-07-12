"use client";

import { HomeSection } from "@/components/04-templates";
import { BadgeDetailsSection } from "@/components/04-templates/BadgeDetailsSection";
import { CheckInSection } from "@/components/04-templates/CheckInSection";
import { CheckOutSection } from "@/components/04-templates/CheckoutSection";
import { GiveBadgeSection } from "@/components/04-templates/GiveBadgeSection";
import { MyBadgeSection } from "@/components/04-templates/MyBadgeSection";
import { PreCheckInSection } from "@/components/04-templates/PreCheckinSection";
import { ShareSection } from "@/components/04-templates/ShareSection";

export default function renderPage({
  params,
}: {
  params: { slug: string; id: number };
}) {
  switch (params.slug) {
    case "pre-checkin":
      return <PreCheckInSection />;
    case "checkin":
      return <CheckInSection />;
    case "checkout":
      return <CheckOutSection />;
    case "share":
      return <ShareSection />;
    case "my-badge":
      return <MyBadgeSection />;
    case "my-badge-details":
      return <BadgeDetailsSection />;
    case "give-badge":
      return <GiveBadgeSection />;
    default:
      return <HomeSection />;
  }
}
