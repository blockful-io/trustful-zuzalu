"use client";

import {
  HomeSection,
  BadgeDetailsSection,
  CheckinSection,
  CheckoutSection,
  GiveBadgeSection,
  MyBadgeSection,
  PreCheckinSection,
  ShareSection,
  AdminSection,
} from "@/components/04-templates/";

export default function renderPage({ params }: { params: { slug: [string] } }) {
  switch (params.slug[0]) {
    case "pre-checkin":
      return <PreCheckinSection />;
    case "checkin":
      return <CheckinSection />;
    case "checkout":
      return <CheckoutSection />;
    case "share":
      return <ShareSection />;
    case "my-badges":
      return <MyBadgeSection />;
    case "my-badge-details":
      return <BadgeDetailsSection />;
    case "give-badge":
      return <GiveBadgeSection />;
    case "admin":
      return <AdminSection />;
    default:
      return <HomeSection />;
  }
}
