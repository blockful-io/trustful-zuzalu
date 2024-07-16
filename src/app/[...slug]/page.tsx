/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect } from "react";

import { optimism } from "viem/chains";
import { useSwitchChain } from "wagmi";

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
import { useNotify } from "@/hooks";
import { useSupportedNetwork } from "@/hooks/useSupportedNetwork";

export default function renderPage({ params }: { params: { slug: [string] } }) {
  const { isNetworkSupported } = useSupportedNetwork();
  const { notifyError } = useNotify();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!isNetworkSupported) {
      notifyError({
        title: "Unsupported network",
        message:
          "Please switch to the supported network to use this application.",
      });
      switchChain({ chainId: optimism.id });
    }
  }, [isNetworkSupported]);

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
