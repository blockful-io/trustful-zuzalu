"use client";

import { HomeSection } from "@/components/04-templates";
import { GiveBadgeSection } from "@/components/04-templates/GiveBadgeSection";
import { MyBadgeSection } from "@/components/04-templates/MyBadgeSection";
import { PreCheckinSection } from "@/components/04-templates/PreCheckinSection";

export default function renderPage({
  params,
}: {
  params: { slug: string; id: number };
}) {
  console.log("params in preCheckin", params);

  switch (params.slug) {
    case "pre-checkin":
      return <PreCheckinSection />;
    case "my-badge":
      return <MyBadgeSection />;
    case "give-badge":
      return <GiveBadgeSection />;
    default:
      return <HomeSection />;
  }
}
