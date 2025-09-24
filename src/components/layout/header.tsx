'use client';

import { Wallet, Search, Bell, Zap, Grid3X3 } from 'lucide-react';
import { ThemeToggle } from '@/components/common';
import { Button, Input } from '@/components/ui';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
    { key: 'markets', href: '/markets', icon: null },
    { key: 'preMarkets', href: '/pre-markets', icon: Zap },
    { key: 'gridView', href: '/grid-view', icon: Grid3X3 },
    { key: 'portfolio', href: '/portfolio', icon: null },
    { key: 'activity', href: '/activity', icon: null },
];

export function Header() {
    const t = useTranslations('navigation');
    const pathname = usePathname();

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

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.endsWith(item.href);
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={`font-mono text-xs font-medium leading-4 transition-colors ${Icon ? 'flex items-center gap-2' : ''
                                        } ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
                                >
                                    {Icon && <Icon className="w-4 h-4 text-primary" />}
                                    {t(item.key)}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Search Bar */}
                    <Input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        rightIcon={<Search className="w-4 h-4" />}
                        className="w-60"
                    />

                    <div className="relative">
                        <Bell className="w-5 h-5 text-foreground cursor-pointer hover:text-primary transition-colors" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                    </div>

                    {/* Connect Wallet Button */}
                    <Button icon={<Wallet className="w-4 h-4" />}>
                        {t('connectWallet')}
                    </Button>
                </div>
            </div>
        </header>
    );
}
