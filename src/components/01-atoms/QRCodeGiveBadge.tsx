import { useQRCode } from "next-qrcode";
import { useAccount } from "wagmi";

export const QRCodeGiveBadge = () => {
  const { Canvas } = useQRCode();
  const { address } = useAccount();

  const prefixToGiveBadge = "https://trustful.ing/give-badge";
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
