'use client';

import { Search, BarChart2, Tag, Activity } from 'lucide-react';
import { ThemeToggle } from '@/components/common';
import { Input } from '@/components/ui';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTableOptionsStore } from '@/stores';

const navigationItems = [
    { key: 'markets', href: '/markets', icon: BarChart2, comingSoon: false },
    // { key: 'gridView', href: '/grid-view', icon: Grid3X3, comingSoon: false },
    { key: 'portfolio', href: '/portfolio', icon: Tag, comingSoon: true },
    { key: 'activity', href: '/activity', icon: Activity, comingSoon: true },
];

export function Header() {
    const t = useTranslations('navigation');
    const pathname = usePathname();
    const { searchQuery, setSearchQuery } = useTableOptionsStore();

    return (
        <header className="bg-background border-t border-border border-b border-border px-2 py-2 h-[49px]">
            <div className="flex items-center justify-between h-full">
                {/* Brand Name and Navigation */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-1 cursor-pointer">
                        <span className="text-primary font-mono text-2xl font-bold leading-8">
                            &gt;_
                        </span>
                        <span className="text-primary font-mono text-2xl font-bold leading-8">
                            PMX_TICKR
                        </span>
                        <div className="w-0.5 h-6 bg-primary cursor-flicker"></div>
                    </Link>

                    {/* Navigation Links - Hidden on mobile */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.endsWith(item.href);
                            return (
                                <div key={item.key} className="flex items-center gap-2">
                                    <Link
                                        href={item.href}
                                        className={`font-mono text-xs font-medium leading-4 transition-colors 
                                            flex items-center gap-2 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
                                    >
                                        <Icon className="w-3 h-3" />
                                        {t(item.key)}
                                    </Link>
                                    {item.comingSoon && (
                                        <span className="bg-secondary text-muted-foreground text-[10px] px-1.5 py-0.5 rounded font-mono">
                                            {t('comingSoon')}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden lg:block">
                        <Input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            rightIcon={<Search className="w-4 h-4" />}
                            className="w-60"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                </div>
            </div>
        </header>
    );
}
