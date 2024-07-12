"use client";
import { useContext } from "react";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { HomeSection } from "@/components/04-templates";
import { WalletContext } from "@/lib/context/WalletContext";

export default function Home() {
  const { isConnected } = useAccount();
  const { push } = useRouter();

  const { villagerAttestationCount } = useContext(WalletContext);

  if (isConnected && villagerAttestationCount === 0) push("/pre-checkin");
  if (isConnected && villagerAttestationCount > 0) push("/my-badge");
  else return <HomeSection />;
}
