import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tickr - live prediction markets on Solana',
  description: 'Tickr is the prediction market platform to see real-time odds, liquidity, and outcome tokens in one place',
  keywords: ['prediction markets', 'Solana', 'crypto', 'trading', 'odds', 'liquidity', 'DeFi'],
  authors: [{ name: 'Tickr Team' }],
  creator: 'Tickr',
  publisher: 'Tickr',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tickr.fi'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'de-DE': '/de',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://tickr.fi',
    title: 'Tickr - live prediction markets on Solana',
    description: 'Tickr is the prediction market platform to see real-time odds, liquidity, and outcome tokens in one place',
    siteName: 'Tickr',
    images: [
      {
        url: '/images/tickr-og.png',
        width: 1200,
        height: 630,
        alt: 'Tickr - live prediction markets on Solana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tickr',
    creator: '@tickr',
    title: 'Tickr - live prediction markets on Solana',
    description: 'Tickr is the prediction market platform to see real-time odds, liquidity, and outcome tokens in one place',
    images: ['/images/ticker-og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#ff4500',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#1a1a1a',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#1a1a1a',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
