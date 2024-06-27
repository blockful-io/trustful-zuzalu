import { type FC } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const MainPane: FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
      <div className="flex w-full">
        <h1 className="text-slate-50 text-[52px] font-normal font-['Space Grotesk'] leading-[57.20px]">
          Online reputation made easy
        </h1>
      </div>
      <div className="flex w-full">
        {!isConnected && <ConnectButton label="Connect" />}
      </div>
    </div>
  );
};
