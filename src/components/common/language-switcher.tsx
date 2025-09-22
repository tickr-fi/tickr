'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const switchLanguage = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
    };

    return (
        <div className="flex items-center">
            <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 text-sm rounded cursor-pointer border border-border ${locale === 'en'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary-background text-muted-foreground hover:bg-secondary-background/80'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => switchLanguage('de')}
                className={`px-3 py-1 text-sm rounded cursor-pointer border border-border ${locale === 'de'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary-background text-muted-foreground hover:bg-secondary-background/80'
                    }`}
            >
                DE
            </button>
        </div>
    );
}
