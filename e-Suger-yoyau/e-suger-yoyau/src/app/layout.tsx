import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "e-Sugar | 予約システム",
  description: "美容・脱毛トータルビューティーサロン e-Sugar の予約システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
