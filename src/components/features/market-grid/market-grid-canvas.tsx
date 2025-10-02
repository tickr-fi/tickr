'use client';

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Market } from '@/lib/types';
import { drawAllTrails } from '@/lib/utils/trail-helpers';
import { timeToCanvasX, timeToCanvasY } from '@/lib/utils/grid-utils';
import { TimePeriod } from '@/lib/utils/trail-helpers';
import { useMarketOptionsStore } from '@/stores';
import {
  getTimeLevelsForFilter,
  getTimeLabelsForFilter,
  getMaxTimeRangeForFilter,
  getMinTimeRangeForFilter,
  getAggregationPeriodForFilter
} from '@/lib/utils/time-filter-utils';

interface MarketGridCanvasProps {
  width: number;
  height: number;
  markets: Market[];
  hoveredMarketSlug: string | null;
}

export interface MarketGridCanvasRef {
  getCanvas: () => HTMLCanvasElement | null;
  getContext: () => CanvasRenderingContext2D | null;
}

export const MarketGridCanvas = forwardRef<MarketGridCanvasRef, MarketGridCanvasProps>(
  function MarketGridCanvas({ width, height, markets, hoveredMarketSlug }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { gridTimeFilter: timeFilter, gridOptionsFilter: optionsFilter } = useMarketOptionsStore();

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getContext: () => canvasRef.current?.getContext('2d') || null,
    }));

    // Draw grid lines for mobile (swapped axes)
    const drawMobileGridLines = useCallback((ctx: CanvasRenderingContext2D, padding: number) => {
      // Set grid style
      ctx.strokeStyle = '#374151'; // Gray grid lines
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      // Draw vertical grid lines (probability levels)
      const probLevels = [25, 50, 75, 100];
      probLevels.forEach(prob => {
        const x = padding + (prob / 100) * (width - padding * 2);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      });

      // Draw horizontal grid lines (time levels) - dynamic based on filter
      const timeLevels = getTimeLevelsForFilter(timeFilter);
      const maxHours = getMaxTimeRangeForFilter(timeFilter);
      const minHours = getMinTimeRangeForFilter();

      timeLevels.forEach(hours => {
        const y = timeToCanvasY(hours, height, padding, maxHours, minHours);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      });
    }, [width, height, timeFilter]);

    // Draw grid lines for desktop (original axes)
    const drawDesktopGridLines = useCallback((ctx: CanvasRenderingContext2D, padding: number) => {
      const canvasHeight = height - (padding * 2);

      // Set grid style
      ctx.strokeStyle = '#374151'; // Gray grid lines
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      // Draw horizontal grid lines (probability levels)
      const probLevels = [25, 50, 75, 100];
      probLevels.forEach(prob => {
        const y = padding + ((100 - prob) / 100) * canvasHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      });

      // Draw vertical grid lines (time levels) - dynamic based on filter
      const timeLevels = getTimeLevelsForFilter(timeFilter);
      const maxHours = getMaxTimeRangeForFilter(timeFilter);
      const minHours = getMinTimeRangeForFilter();

      timeLevels.forEach(hours => {
        const x = timeToCanvasX(hours, width, padding, maxHours, minHours);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      });
    }, [width, height, timeFilter]);

    // Draw axis lines for mobile
    const drawMobileAxisLines = useCallback((ctx: CanvasRenderingContext2D, padding: number) => {
      ctx.setLineDash([]);
      ctx.strokeStyle = '#4b5563'; // Darker gray
      ctx.lineWidth = 1;

      // Mobile: Y-axis line (solid line at left)
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.stroke();
    }, [height]);

    // Draw axis lines for desktop
    const drawDesktopAxisLines = useCallback((ctx: CanvasRenderingContext2D, padding: number) => {
      ctx.setLineDash([]);
      ctx.strokeStyle = '#4b5563'; // Darker gray
      ctx.lineWidth = 1;

      // Desktop: X-axis line (solid line at bottom)
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();
    }, [width, height]);

    // Draw axis labels for mobile
    const drawMobileAxisLabels = useCallback((ctx: CanvasRenderingContext2D, padding: number) => {
      ctx.fillStyle = '#9ca3af'; // Gray text
      ctx.font = '10px monospace'; // Smaller font on mobile
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // X-axis tick labels (probability levels)
      const probLevels = [25, 50, 75, 100];
      probLevels.forEach(prob => {
        const x = padding + (prob / 100) * (width - padding * 2);
        ctx.textAlign = 'center';
        ctx.fillText(`${prob}%`, x, height - padding + 10);
      });

      // Y-axis tick labels (time levels) - dynamic based on filter
      const timeLabels = getTimeLabelsForFilter(timeFilter);
      const maxHours = getMaxTimeRangeForFilter(timeFilter);
      const minHours = getMinTimeRangeForFilter();

      timeLabels.forEach(({ hours, label }) => {
        const y = timeToCanvasY(hours, height, padding, maxHours, minHours);
        ctx.textAlign = 'right';
        ctx.fillText(label, padding - 5, y);
      });
    }, [width, height, timeFilter]);

    // Draw axis labels for desktop
    const drawDesktopAxisLabels = useCallback((ctx: CanvasRenderingContext2D, padding: number) => {
      ctx.fillStyle = '#9ca3af'; // Gray text
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Desktop: Original axes - time on X-axis, probability on Y-axis
      // Y-axis label (Implied Probability)
      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('IMPLIED PROBABILITY', 0, 0);
      ctx.restore();

      // X-axis label (Time Remaining)
      ctx.textAlign = 'center';
      ctx.fillText('TIME REMAINING', width / 2, height - 10);

      // Y-axis tick labels
      const probLevels = [25, 50, 75, 100];
      probLevels.forEach(prob => {
        const y = padding + ((100 - prob) / 100) * (height - padding * 2);
        ctx.textAlign = 'right';
        ctx.fillText(`${prob}%`, padding - 10, y);
      });

      // X-axis tick labels - dynamic based on filter
      const timeLabels = getTimeLabelsForFilter(timeFilter);
      const maxHours = getMaxTimeRangeForFilter(timeFilter);
      const minHours = getMinTimeRangeForFilter();

      timeLabels.forEach(({ hours, label }) => {
        const x = timeToCanvasX(hours, width, padding, maxHours, minHours);
        ctx.textAlign = 'center';
        ctx.fillText(label, x, height - padding + 20);
      });
    }, [width, height, timeFilter]);

    // Draw trails
    const drawTrails = useCallback((ctx: CanvasRenderingContext2D, padding: number) => {
      // Get aggregation period and scaling parameters based on time filter
      const aggregationPeriod = getAggregationPeriodForFilter(timeFilter) as TimePeriod;
      const maxHours = getMaxTimeRangeForFilter(timeFilter);
      const minHours = getMinTimeRangeForFilter();

      // Draw all trails with dynamic aggregation and scaling
      const isLargeScreen = width >= 1024;
      drawAllTrails(ctx, markets, hoveredMarketSlug, width, height, padding, aggregationPeriod, maxHours, minHours, optionsFilter, isLargeScreen);
    }, [width, height, markets, hoveredMarketSlug, timeFilter, optionsFilter]);

    // Main draw function
    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      // Set up proper canvas scaling
      const dpr = window.devicePixelRatio || 1;

      // Set the actual canvas size in memory
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Scale the drawing context so everything draws at the correct size
      ctx.scale(dpr, dpr);

      // Set the display size of the canvas
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 1024;
      // Calculate padding
      const padding = isMobile ? 20 : 60; // Match grid padding calculation

      if (isMobile) {
        // Mobile drawing methods
        drawMobileGridLines(ctx, padding);
        drawMobileAxisLines(ctx, padding);
        drawMobileAxisLabels(ctx, padding);
      } else {
        // Desktop drawing methods
        drawDesktopGridLines(ctx, padding);
        drawDesktopAxisLines(ctx, padding);
        drawDesktopAxisLabels(ctx, padding);
      }

      // Draw trails (shared method with responsive parameters)
      drawTrails(ctx, padding);
    }, [
      drawMobileGridLines,
      drawDesktopGridLines,
      drawMobileAxisLines,
      drawDesktopAxisLines,
      drawMobileAxisLabels,
      drawDesktopAxisLabels,
      drawTrails,
      width,
      height
    ]);

    // Redraw when dimensions change
    useEffect(() => {
      draw();
    }, [draw]);

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair block"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    );
  }
);
