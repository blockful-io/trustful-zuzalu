import { Box } from "@chakra-ui/react";

import { BadgeDetailsNavigation, TheFooterNavbar } from "@/components/01-atoms";

import QRCodeScanner from "../01-atoms/QRCodeScanner";

export const QRCode = () => {
  const onNewScanResult = (decodedText: string, decodedResult: any) => {
    console.log("onNewScanResult", decodedText, decodedResult);
    return decodedText;
  };
  return (
    <Box className="flex flex-col items-center w-full">
      <BadgeDetailsNavigation isQRCode={true} />
      <Box className="flex-1 flex-col justify-center items-center">
        <QRCodeScanner
          fps={10}
          qrbox={{ width: 300, height: 300 }}
          disableFlip={false}
          aspectRatio={1.0}
          qrCodeSuccessCallback={onNewScanResult}
        />
        <TheFooterNavbar />
      </Box>
    </Box>
  );
};
