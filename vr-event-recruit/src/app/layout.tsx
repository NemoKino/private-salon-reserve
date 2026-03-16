import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'VR Workers | VRChat (VRC) イベント・キャスト募集',
    template: '%s | VR Workers',
  },
  description: 'VRChat (VRC) イベントのキャスト募集掲示板。ログイン不要。様々なジャンルのイベントを掲載中。',
  openGraph: {
    title: 'VR Workers | キャスト募集サイト',
    description: 'VRChat (VRC) イベントのキャスト募集掲示板。ログイン不要。様々なジャンルのイベントを掲載中。',
    url: '/',
    siteName: 'VR Workers',
    locale: 'ja_JP',
    type: 'website',
    images: ['/images/sample-club-hero.jpg'], // Default OGP Image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VR Workers | キャスト募集サイト',
    description: 'VRChat (VRC) イベントのキャスト募集掲示板。ログイン不要。様々なジャンルのイベントを掲載中。',
    images: ['/images/sample-club-hero.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@400;600;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}
