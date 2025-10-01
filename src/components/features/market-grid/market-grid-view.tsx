'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Market } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { MarketGridCanvas, MarketGridCanvasRef } from './market-grid-canvas';
import { MarketGridPoint } from './market-grid-point';
import { MarketGridTimeFilter, type TimeFilter } from './market-grid-time-filter';
import { useCanvasDimensions } from '@/hooks/useCanvasDimensions';
import { transformMarketsToGridData } from '@/lib/utils/grid-utils';
import { filterMarketsByTime, getMaxTimeRangeForFilter, getMinTimeRangeForFilter } from '@/lib/utils/time-filter-utils';

interface MarketGridViewProps {
  markets: Market[];
  isLoading?: boolean;
}

const TIME_FILTER_ORDER: TimeFilter[] = ['<1h', '<24h', '<7d', '<30d', 'All'];

export function MarketGridView({ markets, isLoading = false }: MarketGridViewProps) {
  const t = useTranslations('markets');
  const { dimensions } = useCanvasDimensions('[data-grid-container]');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('All');
  const canvasRef = useRef<MarketGridCanvasRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const filteredMarkets = filterMarketsByTime(markets, timeFilter);
  
  const maxHours = getMaxTimeRangeForFilter(timeFilter);
  const minHours = getMinTimeRangeForFilter();
  
  const dataPoints = transformMarketsToGridData(
    filteredMarkets,
    dimensions.width,
    dimensions.height,
    60,
    maxHours,
    minHours
  );

  const handleHoverChange = (pointIndex: number, isHovered: boolean) => {
    setHoveredPointIndex(isHovered ? pointIndex : null);
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
  }, [timeFilter]);

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
      <div className="flex items-center justify-center h-[calc(100vh-220px)]">
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
      className="w-full h-[calc(100vh-200px)] overflow-hidden -mx-4 relative"
      data-grid-container
    >
      <MarketGridTimeFilter 
        selectedFilter={timeFilter}
        onFilterChange={setTimeFilter}
      />
      
      <div className="ml-4 relative">
        <MarketGridCanvas 
          ref={canvasRef}
          width={dimensions.width} 
          height={dimensions.height}
          markets={filteredMarkets}
          hoveredPointIndex={hoveredPointIndex}
          timeFilter={timeFilter}
        />
        
        {dataPoints.map((dataPoint, index) => (
          <MarketGridPoint
            key={`${dataPoint.market.slug}-${index}`}
            market={dataPoint.market}
            x={dataPoint.x}
            y={dataPoint.y}
            size={dataPoint.size}
            onHoverChange={(isHovered) => handleHoverChange(index, isHovered)}
          />
        ))}
      </div>
    </div>
  );
}
