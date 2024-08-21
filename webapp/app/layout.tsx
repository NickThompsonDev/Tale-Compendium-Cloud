import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ApiClerkProvider from "@/providers/ApiClerkProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tale Compendium",
  description: "Generate your Tale with the help of AI",
  icons: {
    icon: "/icons/tclogo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApiClerkProvider>
      <html lang="en">
        <body className={`${manrope.className}`}>{children}</body>
      </html>
    </ApiClerkProvider>
  );
}
