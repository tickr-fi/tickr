import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { Providers } from '@/app/providers';
import { Header, SmallHeader } from '@/components/layout';
import '@/app/globals.css';
import { JetBrains_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
});

interface Props {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${jetbrainsMono.variable} font-mono antialiased bg-background text-foreground`}>
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <div className="min-h-screen bg-background text-foreground">
                            <SmallHeader />
                            <Header />
                            {children}
                        </div>
                    </Providers>
                </NextIntlClientProvider>
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
