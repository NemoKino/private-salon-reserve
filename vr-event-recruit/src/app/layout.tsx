import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VR Event Recruit | キャスト募集サイト',
  description: 'VRChat内の継続イベントによるキャスト募集掲示板。ログイン不要・Twitter誘導型。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
