'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Market } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { MarketGridCanvas, MarketGridCanvasRef } from './market-grid-canvas';
import { MarketGridPoint } from './market-grid-point';
import { MarketGridTimeFilter } from './market-grid-time-filter';
import { MarketGridOptionsFilter } from './market-grid-options-filter';
import { useCanvasDimensions } from '@/hooks/useCanvasDimensions';
import { useResponsiveViewMode } from '@/hooks/useResponsiveViewMode';
import { transformMarketsToGridData } from '@/lib/utils/grid-utils';
import { filterMarketsByTime, getMaxTimeRangeForFilter, getMinTimeRangeForFilter } from '@/lib/utils/time-filter-utils';
import { useMarketOptionsStore, type GridTimeFilter } from '@/stores';

interface MarketGridViewProps {
  markets: Market[];
  isLoading?: boolean;
}

const TIME_FILTER_ORDER: GridTimeFilter[] = ['<1h', '<24h', '<7d', '<30d', 'All'];

export function MarketGridView({ markets, isLoading = false }: MarketGridViewProps) {
  const t = useTranslations('markets');
  const { dimensions } = useCanvasDimensions('[data-grid-container]');
  const { isLargeScreen } = useResponsiveViewMode();
  const [hoveredMarketSlug, setHoveredMarketSlug] = useState<string | null>(null);
  const canvasRef = useRef<MarketGridCanvasRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    gridTimeFilter: timeFilter,
    setGridTimeFilter: setTimeFilter,
    gridOptionsFilter: optionsFilter,
    setGridOptionsFilter: setOptionsFilter
  } = useMarketOptionsStore();

  const filteredMarkets = filterMarketsByTime(markets, timeFilter);

  const maxHours = getMaxTimeRangeForFilter(timeFilter);
  const minHours = getMinTimeRangeForFilter();

  const padding = isLargeScreen ? 60 : 20; // Match canvas padding calculation
  const canvasHeight = dimensions.height - (isLargeScreen ? 0 : 90); // Match canvas height calculation
  
  const dataPoints = transformMarketsToGridData(
    filteredMarkets,
    dimensions.width,
    canvasHeight,
    padding,
    maxHours,
    minHours,
    optionsFilter,
    isLargeScreen
  );

  const handleHoverChange = (pointIndex: number, isHovered: boolean) => {
    if (isHovered) {
      const hoveredPoint = dataPoints[pointIndex];
      setHoveredMarketSlug(hoveredPoint.market.slug);
    } else {
      setHoveredMarketSlug(null);
    }
  };

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();

    const currentIndex = TIME_FILTER_ORDER.indexOf(timeFilter);
    let newIndex: number;

    if (event.deltaY > 0) {
      // Scroll down - go to next filter
      newIndex = Math.min(currentIndex + 1, TIME_FILTER_ORDER.length - 1);
    } else {
      // Scroll up - go to previous filter
      newIndex = Math.max(currentIndex - 1, 0);
    }

    const newFilter = TIME_FILTER_ORDER[newIndex];
    if (newFilter !== timeFilter) {
      setTimeFilter(newFilter);
    }
  }, [timeFilter, setTimeFilter]);

  // Set up wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)]">
        <div className="text-center">
          <div className="text-muted-foreground font-mono mb-2">
            {t('loading')}
          </div>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[calc(100vh-200px)] lg:h-[calc(100vh-200px)] overflow-hidden relative px-0"
      data-grid-container
    >
      <div className="flex flex-col lg:absolute lg:top-4 lg:left-1/2 lg:transform
      lg:-translate-x-1/2 lg:z-10 lg:flex-row gap-2 lg:gap-4 lg:mb-0 items-center lg:items-stretch">
        <MarketGridTimeFilter
          selectedFilter={timeFilter}
          onFilterChange={setTimeFilter}
        />
        <MarketGridOptionsFilter
          selectedFilter={optionsFilter}
          onFilterChange={setOptionsFilter}
        />
      </div>

      <div className="relative">
        <MarketGridCanvas
          ref={canvasRef}
          width={dimensions.width}
          height={canvasHeight}
          markets={filteredMarkets}
          hoveredMarketSlug={hoveredMarketSlug}
        />

        {dataPoints.map((dataPoint, index) => {
          const isPairedHovered = hoveredMarketSlug === dataPoint.market.slug;

          return (
            <MarketGridPoint
              key={`${dataPoint.market.slug}-${dataPoint.optionType}-${index}`}
              market={dataPoint.market}
              x={dataPoint.x}
              y={dataPoint.y}
              size={dataPoint.size}
              optionType={dataPoint.optionType}
              isPairedHovered={isPairedHovered}
              onHoverChange={(isHovered) => handleHoverChange(index, isHovered)}
            />
          );
        })}
      </div>
    </div>
  );
}
