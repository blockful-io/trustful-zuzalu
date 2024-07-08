import { useContext, useState } from "react";

import { Box } from "@chakra-ui/react";
import { isAddress } from "viem";

import {
  BadgeDetailsNavigation,
  TheFooterNavbar,
  QRCodeScanner,
} from "@/components/01-atoms";
import {
  GiveBadgeAction,
  GiveBadgeStepAddress,
} from "@/components/04-templates";
import { QRCodeContext } from "@/lib/context/QRCodeContext";
import { EthereumAddress } from "@/lib/shared/types";


export const QRCode = () => {
  const { setBadgeInputAddress, setAddressStep, setAction } =
    useContext(QRCodeContext);
  const [QRCodeIsOpen, setQRCodeisOpen] = useState<boolean>(true);
  const onNewScanResult = (decodedText: string) => {
    if (isAddress(decodedText)) {
      setQRCodeisOpen(false);
      setBadgeInputAddress(new EthereumAddress(decodedText));
      setAction(GiveBadgeAction.ADDRESS);
      setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
    }
    return decodedText;
  };

  return (
    <Box className="flex flex-col items-center w-full">
      <BadgeDetailsNavigation isQRCode={true} />
      <Box className="flex-1 w-full flex-col justify-center items-center p-6 sm:px-[60px] sm:py-[80px]">
        <QRCodeScanner
          fps={10}
          qrbox={{ width: 300, height: 300 }}
          disableFlip={false}
          aspectRatio={1.0}
          qrCodeSuccessCallback={onNewScanResult}
          open={QRCodeIsOpen}
        />
      </Box>
      <TheFooterNavbar />
    </Box>
  );
};
