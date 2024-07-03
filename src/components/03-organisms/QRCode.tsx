import { Box } from "@chakra-ui/react";
import Image from "next/image";

import { BadgeDetailsNavigation } from "@/components/01-atoms";

import qrCodeImage from "../../../public/img/QR-Code-image.png";

export const QRCode = () => {
  return (
    <Box className="absolute w-full h-full">
      <BadgeDetailsNavigation isQRCode={true} />
      <Image
        src={qrCodeImage}
        fill
        alt={"QR CODE IMAGE"}
        className="relative"
      />
    </Box>
  );
};
