"use client";

import { HomeSection } from "@/components/04-templates";
import { BadgeDetailsSection } from "@/components/04-templates/BadgeDetailsSection";
import { CheckInSection } from "@/components/04-templates/CheckInSection";
import { CheckOutSection } from "@/components/04-templates/CheckOutSection";
import { GiveBadgeSection } from "@/components/04-templates/GiveBadgeSection";
import { MyBadgeSection } from "@/components/04-templates/MyBadgeSection";
import { PreCheckInSection } from "@/components/04-templates/PreCheckInSection";

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
