"use client";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { HomeSection } from "@/components/04-templates";

export default function Home() {
  const { isConnected } = useAccount();
  const { push } = useRouter();

  if (isConnected) push("/my-badge");
  else return <HomeSection />;
}
