import { type FC } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const MainPane: FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
      <div className="flex">
        <h1>Online reputation made easy</h1>
      </div>
      <div className="flex">
        {!isConnected && <ConnectButton label="Connect" />}
      </div>
    </div>
  );
};
