'use client';

import { useEffect } from 'react';
import { Market } from '@/lib/types';
import { MarketTable } from '@/components/features/markets/market-table';
import { MarketCardsGrid } from '@/components/features/markets/market-cards-grid';
import { MarketHeader } from '@/components/features/markets/market-header';
import { MobileMarketOptions } from '@/components/features/markets/mobile-market-options';
import { useTableOptionsStore } from '@/stores';
import { useResponsiveViewMode } from '@/hooks/useResponsiveViewMode';
import { useTranslations } from 'next-intl';

interface MarketViewProps {
    markets: Market[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

export function MarketView({ markets, isLoading = false, onRefresh }: MarketViewProps) {
    const t = useTranslations('markets');
    const {
        statusFilter,
        selectedSort,
        setSelectedSort,
        searchQuery,
        timeFrameFilter,
        liquidityFilter,
        hideIlliquidMarkets,
        showMovers10Percent,
        showAdvancedFilters,
        lastUpdate,
        setLastUpdate,
        viewMode,
        showMobileMenu,
    } = useTableOptionsStore();

    const { isLargeScreen } = useResponsiveViewMode();

    useEffect(() => {
        setLastUpdate(new Date());
    }, [setLastUpdate]);

    const handleRefresh = () => {
        setLastUpdate(new Date());
        onRefresh?.();
    };

    const filteredMarkets = markets.filter(market => {
        // Status filter
        let statusMatch = true;
        if (statusFilter === 'ACTIVE') { statusMatch = !market.resolved; }
        if (statusFilter === 'RESOLVED') { statusMatch = market.resolved; }

        // Search filter
        let searchMatch = true;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            searchMatch = market.title.toLowerCase().includes(query);
        }

        // Timeframe filter
        let timeFrameMatch = true;
        if (timeFrameFilter !== 'all') {
            const now = new Date();
            const endDate = new Date(market.end_date);
            const hoursUntilEnd = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);

            switch (timeFrameFilter) {
                case '24h':
                    timeFrameMatch = hoursUntilEnd <= 24;
                    break;
                case '7d':
                    timeFrameMatch = hoursUntilEnd <= 168; // 7 * 24
                    break;
                case '30d':
                    timeFrameMatch = hoursUntilEnd <= 720; // 30 * 24
                    break;
            }
        }

        // Liquidity filter
        let liquidityMatch = true;
        if (liquidityFilter !== 'any' && market.limit) {
            const minLiquidity = {
                '10k': 10000,
                '50k': 50000,
                '100k': 100000,
            }[liquidityFilter] || 0;

            liquidityMatch = market.limit >= minLiquidity;
        }

        // Hide illiquid markets filter
        let illiquidMatch = true;
        if (hideIlliquidMarkets) {
            illiquidMatch = market.limit ? market.limit >= 10000 : false; // Consider <10k as illiquid
        }

        // Movers 10% filter
        let moversMatch = true;
        if (showMovers10Percent) {
            // Check if any option has 24h change >= 10%
            const hasSignificantChange = Object.values(market.cas).some(option => {
                return option.change24h !== undefined && Math.abs(option.change24h) >= 10;
            });
            moversMatch = hasSignificantChange;
        }

        return statusMatch && searchMatch && timeFrameMatch && liquidityMatch && illiquidMatch && moversMatch;
    }).sort((a, b) => {
        // First apply filter-based sorting
        if (statusFilter === 'ALL') {
            if (a.resolved && !b.resolved) { return 1; }
            if (!a.resolved && b.resolved) { return -1; }
        }

        // Then apply user-selected sorting
        switch (selectedSort) {
            case 'expiringSoon':
                return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
            case 'expiringLater':
                return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'highestLiquidity':
                return (b.limit || 0) - (a.limit || 0);
            default:
                return 0;
        }
    });

    const calculatedViewMode = isLargeScreen ? viewMode : 'cards';
    return (
        <div className="w-full bg-background relative">
            <MarketHeader
                lastUpdate={lastUpdate || undefined}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                showAdvancedFilters={showAdvancedFilters}
            />

            {showMobileMenu && (
                <div className="absolute top-[40px] left-0 right-0 z-[9999]">
                    <MobileMarketOptions
                        selectedSort={selectedSort}
                        onSortChange={setSelectedSort}
                        showAdvancedFilters={showAdvancedFilters}
                    />
                </div>
            )}

            {calculatedViewMode === 'table' ? (
                <MarketTable markets={filteredMarkets} isLoading={isLoading} />
            ) : (
                <MarketCardsGrid markets={filteredMarkets} isLoading={isLoading} />
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 px-2">
                <div className="text-xs font-mono text-muted-foreground">
                    {t('showing', { count: filteredMarkets.length })}
                </div>
            </div>
        </div>
    );
}
