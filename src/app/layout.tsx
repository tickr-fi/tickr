import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tickr',
  description: 'Discover and analyze the hottest prediction markets on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
