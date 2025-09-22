import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

interface Props {
  params: Promise<{ locale: string }>;
}

export default function GridViewPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground font-mono">
          GRID_VIEW
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
          Visual grid layout of all markets
        </p>
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
