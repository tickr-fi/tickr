import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { use } from 'react';

interface Props {
  params: Promise<{ locale: string }>;
};

export default function HomePage({ params }: Props) {
  const { locale } = use(params);

  setRequestLocale(locale);

  // Redirect to markets page as the default
  redirect(`/${locale}/markets`);
}

// Enable static rendering
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'de' }
  ];
}
