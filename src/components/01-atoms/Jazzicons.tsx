import { type FC } from "react";

import { Skeleton } from "@chakra-ui/react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

type JazziconsProps = {
  seed: string;
  size?: number;
};

export const Jazzicons: FC<JazziconsProps> = ({ seed, size }) => {
  if (!seed) return <Skeleton height={40} />;

  if (size) return <Jazzicon seed={jsNumberForAddress(seed)} diameter={size} />;

  return <Jazzicon seed={jsNumberForAddress(seed)} />;
};
