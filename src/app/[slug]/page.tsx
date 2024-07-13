"use client";

import {
  HomeSection,
  BadgeDetailsSection,
  CheckInSection,
  CheckoutSection,
  GiveBadgeSection,
  MyBadgeSection,
  PreCheckinSection,
  ShareSection,
  //AdminSection,
} from "@/components/04-templates/";

export default function renderPage({
  params,
}: {
  params: { slug: string; id: number };
}) {
  switch (params.slug) {
    case "pre-checkin":
      return <PreCheckinSection />;
    case "checkin":
      return <CheckInSection />;
    case "checkout":
      return <CheckoutSection />;
    case "share":
      return <ShareSection />;
    case "my-badge":
      return <MyBadgeSection />;
    case "my-badge-details":
      return <BadgeDetailsSection />;
    case "give-badge":
      return <GiveBadgeSection />;
    // case "admin":
    //   return <AdminSection />;
    default:
      return <HomeSection />;
  }
}
