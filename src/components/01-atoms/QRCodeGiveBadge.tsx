import { useQRCode } from "next-qrcode";
import { useAccount } from "wagmi";

import { useUrl } from "@/hooks/useURL";

export const QRCodeGiveBadge = () => {
  const { Canvas } = useQRCode();
  const { address } = useAccount();

  const url = useUrl();
  let prefixToGiveBadge: string = "http://localhost:3000/give-badge";
  if (url) {
    if (url.hostname === "localhost") {
      prefixToGiveBadge = "http://localhost:3000/give-badge";
    } else if (url.hostname === "trustful") {
      prefixToGiveBadge = "https://trustful.vercel.app/give-badge";
    }
  }
  const linkToGiveBadgeAddress = `${prefixToGiveBadge}?address=${address}`;

  return (
    <Canvas
      text={linkToGiveBadgeAddress}
      options={{
        errorCorrectionLevel: "M",
        width: 250,
        color: {
          dark: "#F5FFFFDC",
          light: "#212223",
        },
      }}
    />
  );
};
