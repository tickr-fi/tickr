import { setRequestLocale } from 'next-intl/server';
import { marketsController } from '@/lib/controllers';
import { MarketsPageClient } from './markets-client';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function MarketsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const result = await marketsController.getAllMarkets(20);
  const markets = result.success ? result.data || [] : [];

  return (
    <main className="w-full px-4 py-4">
      <MarketsPageClient initialMarkets={markets} />
    </main>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'de' }
  ];
}
