import type { ReactNode } from "react";

import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trustful",
  applicationName: "Trustful",
  description: "Trustful",
  authors: {
    name: "Blockful",
    url: "https://github.com/blockful-io/trustful-zuzalu",
  },
  icons: "favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
