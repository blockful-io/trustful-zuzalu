"use client";

import { HomeSection } from "@/components/04-templates";
import { BadgeDetailsSection } from "@/components/04-templates/BadgeDetailsSection";
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
    case "my-badge-details":
      return <BadgeDetailsSection />;
    case "give-badge":
      return <GiveBadgeSection />;
    default:
      return <HomeSection />;
  }
}
