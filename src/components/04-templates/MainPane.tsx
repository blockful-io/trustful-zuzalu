import { type FC } from "react";

import Image from "next/image";
import { useAccount } from "wagmi";

import { CustomConnectButon } from "@/components/01-atoms/";
import { useWindowSize } from "@/hooks";
import Background from "@/styles/Background.png";

export const MainPane: FC = () => {
  const { isConnected } = useAccount();
  const { isMobile } = useWindowSize();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
      {isMobile && (
        <Image
          alt="Background Image"
          src={Background}
          quality={100}
          fill
          className="opacity-10"
        />
      )}
      <div className="flex w-full">
        <h1 className="text-slate-50 text-[52px] font-normal font-['Space Grotesk'] leading-[57.20px]">
          Online reputation made easy
        </h1>
      </div>
      <div className="flex w-full">
        {!isConnected && <CustomConnectButon />}
      </div>
    </div>
  );
};
