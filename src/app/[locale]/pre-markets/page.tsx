import { setRequestLocale } from 'next-intl/server';
import { premarketsController } from '@/lib/controllers';
import { PremarketsClient } from './premarkets-client';

interface Props {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export default async function PreMarketsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const result = await premarketsController.getAllPremarkets(20, 0);
  const premarkets = result.success ? result.data || [] : [];

  return (
    <main className="w-full px-4 py-4">
      <PremarketsClient initialPremarkets={premarkets} />
    </main>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'de' }
  ];
}
