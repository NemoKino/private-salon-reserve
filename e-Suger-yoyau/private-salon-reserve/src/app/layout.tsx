import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEMO | 予約システム",
  description: "トータルビューティーサロン DEMO の予約システム",
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
