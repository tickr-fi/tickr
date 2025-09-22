import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { SimpleDbTest } from '@/components/features';

interface Props {
  params: Promise<{ locale: string }>;
}

export default function MarketsPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-foreground font-mono">
          MARKETS
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
          Discover and analyze prediction markets
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <SimpleDbTest />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'de' }
  ];
}
