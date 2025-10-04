'use client';

import { useState, useEffect } from 'react';
import { PremarketTable, PremarketHeader } from '@/components/features/premarkets';
import { Premarket } from '@/lib/types';
import { usePremarketOptionsStore, useGlobalLoadingStore } from '@/stores';

interface PremarketsClientProps {
    initialPremarkets: Premarket[];
}

export function PremarketsClient({ initialPremarkets }: PremarketsClientProps) {
    const [premarkets, setPremarkets] = useState<Premarket[]>(initialPremarkets);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(initialPremarkets.length || 0);
    const {
        selectedSort,
        searchQuery,
        timeFrameFilter,
        fundingFilter,
        progressFilter,
        hideIlliquidMarkets,
        setLastUpdate,
        lastUpdate
    } = usePremarketOptionsStore();
    const { setIsLoading: setGlobalLoading } = useGlobalLoadingStore();

    const fetchPremarkets = async (reset = false) => {
        try {
            if (reset) {
                setIsLoading(true);
                setOffset(0);
            } else {
                setIsLoadingMore(true);
            }

            const currentOffset = reset ? 0 : offset;
            const response = await fetch(`/api/premarkets/all?limit=20&offset=${currentOffset}`);
            const data = await response.json();

            if (data.success) {
                const newPremarkets = data.data || [];

                if (reset) {
                    setPremarkets(newPremarkets);
                } else {
                    // Filter out duplicates based on slug
                    setPremarkets(prev => {
                        const existingSlugs = new Set(prev.map((p: Premarket) => p.slug));
                        const uniqueNewPremarkets = newPremarkets.filter((p: Premarket) => !existingSlugs.has(p.slug));
                        return [...prev, ...uniqueNewPremarkets];
                    });
                }

                setOffset(currentOffset + 20);
                setHasMore(newPremarkets.length === 20);
                setLastUpdate(new Date());
            }
        } catch {
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    const handleRefresh = () => {
        setOffset(0);
        fetchPremarkets(true);
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchPremarkets(false);
        }
    };

    useEffect(() => {
        setHasMore(initialPremarkets.length === 20);
        if (initialPremarkets.length > 0 && !lastUpdate) {
            setLastUpdate(new Date());
        }
    }, [initialPremarkets.length, lastUpdate, setLastUpdate]);

    // Set global loading to false when component mounts
    useEffect(() => {
        setGlobalLoading(false);
    }, [setGlobalLoading]);

    // Filter premarkets
    const filteredPremarkets = premarkets.filter(premarket => {
        // Search filter
        let searchMatch = true;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            searchMatch = premarket.name.toLowerCase().includes(query);
        }

        // Timeframe filter
        let timeFrameMatch = true;
        if (timeFrameFilter !== 'all') {
            const now = new Date();
            const endDate = new Date(premarket.end_date);
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

        // Funding filter
        let fundingMatch = true;
        if (fundingFilter !== 'any') {
            const minFunding = {
                '1k': 1000,
                '5k': 5000,
                '10k': 10000,
            }[fundingFilter] || 0;

            fundingMatch = (premarket.balance || 0) >= minFunding;
        }

        // Progress filter
        let progressMatch = true;
        if (progressFilter !== 'any') {
            const minProgress = {
                '25': 25,
                '50': 50,
                '75': 75,
            }[progressFilter] || 0;

            progressMatch = (premarket.fundingProgress || 0) >= minProgress;
        }

        // Hide illiquid markets filter (balance < $500)
        let illiquidMatch = true;
        if (hideIlliquidMarkets) {
            illiquidMatch = (premarket.balance || 0) >= 500;
        }

        return searchMatch && timeFrameMatch && fundingMatch && progressMatch && illiquidMatch;
    });

    const sortedPremarkets = [...filteredPremarkets].sort((a, b) => {
        switch (selectedSort) {
            case 'expiringSoon':
                return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
            case 'expiringLater':
                return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
            case 'alphabetical':
                return a.name.localeCompare(b.name);
            case 'liquidity':
                return b.limit - a.limit;
            case 'progress':
                const progressA = a.fundingProgress || 0;
                const progressB = b.fundingProgress || 0;
                return progressB - progressA;
            case 'funding':
                // First sort by funding progress (descending)
                const fundingProgressA = a.fundingProgress || 0;
                const fundingProgressB = b.fundingProgress || 0;
                if (fundingProgressA !== fundingProgressB) {
                    return fundingProgressB - fundingProgressA;
                }
                // Then sort by balance (descending)
                const balanceA = a.balance || 0;
                const balanceB = b.balance || 0;
                return balanceB - balanceA;
            default:
                return 0;
        }
    });

    return (
        <div className="w-full bg-background relative">
            <PremarketHeader
                lastUpdate={lastUpdate || undefined}
                isLoading={isLoading}
                onRefresh={handleRefresh}
            />

            <PremarketTable
                premarkets={sortedPremarkets}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
            />
        </div>
    );
}
