import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RecoveryRedirect from "@/components/auth/RecoveryRedirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "COMBEE | 나에게 맞는 PC의 시작",
  description: "PC 부품을 탐색하고 사양을 확인하세요. 내 컴퓨터를 알아가는 첫걸음, COMBEE.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><RecoveryRedirect />{children}</body>
    </html>
  );
}
