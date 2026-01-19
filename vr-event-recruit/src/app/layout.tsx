import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'VR CAST LINK | キャスト募集サイト',
    template: '%s | VR CAST LINK',
  },
  description: 'VRChat内の継続イベントによるキャスト募集掲示板。ログイン不要・Twitter誘導型。',
  openGraph: {
    title: 'VR CAST LINK | キャスト募集サイト',
    description: 'VRChat内の継続イベントによるキャスト募集掲示板。',
    url: '/',
    siteName: 'VR CAST LINK',
    locale: 'ja_JP',
    type: 'website',
    images: ['/images/sample-club-hero.jpg'], // Default OGP Image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VR CAST LINK | キャスト募集サイト',
    description: 'VRChat内の継続イベントによるキャスト募集掲示板。',
    images: ['/images/sample-club-hero.jpg'],
  },
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
