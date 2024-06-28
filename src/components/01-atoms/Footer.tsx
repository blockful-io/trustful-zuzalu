import { type FC } from "react";

import { BlockfulLogo } from "@/components/01-atoms";

export const Footer: FC = () => {
  return (
    <div className="flex fixed bottom-0 left-0 right-0 z-10 text-left px-6 py-7">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium leading-3 uppercase tracking-wider text-gray-200 opacity-50">
          Created by
        </p>
        <BlockfulLogo className="flex w-full" />
      </div>
    </div>
  );
};
