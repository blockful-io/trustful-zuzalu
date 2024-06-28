"use client";
import { type FC } from "react";

import { useAccount } from "wagmi";

import { CustomConnectButon, TrustfulIcon } from "@/components/01-atoms";
import { useWindowSize } from "@/hooks";

export const Header: FC = () => {
  const { isConnected } = useAccount();
  const { isMobile } = useWindowSize();

  return (
    <div className="flex sticky top-0 z-10 justify-between border-b border-[#F5FFFF14] py-5 h-14 px-6 sm:px-[60px] items-center">
      <div className="flex w-full justify-between">
        <div className="flex w-full gap-1">
          <TrustfulIcon />
          <h1 className="flex items-center text-white">Trustful</h1>
        </div>
        {!isConnected && !isMobile && (
          <CustomConnectButon
            className={
              "w-[113px] h-9 px-6 bg-lime-400 rounded-lg justify-center items-center gap-2 inline-flex transition ease-out duration-300 text-center text-neutral-900 text-base font-medium font-['Inter'] leading-snug "
            }
          />
        )}
      </div>

      <div>{isConnected && <CustomConnectButon />}</div>
    </div>
  );
};
