'use client';

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Market } from '@/lib/types';
import { drawAllTrails } from '@/lib/utils/trail-helpers';
import { timeToCanvasX } from '@/lib/utils/grid-utils';
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

    // Draw grid function
    const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
      const padding = 60;
      const canvasHeight = height - (padding * 2);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

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

      // Draw X-axis line (solid line at bottom)
      ctx.setLineDash([]);
      ctx.strokeStyle = '#4b5563'; // Darker gray
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();
    }, [width, height, timeFilter]);

    // Draw axes labels
    const drawAxesLabels = useCallback((ctx: CanvasRenderingContext2D) => {
      const padding = 60;

      ctx.fillStyle = '#9ca3af'; // Gray text
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Y-axis label (Implied Probability)
      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('IMPLIED PROBABILITY', 0, 0);
      ctx.restore();

      // X-axis label (Time Remaining)
      ctx.textAlign = 'center';
      ctx.fillText('TIME REMAINING', width / 2, height - 5);

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

    // Draw grid
    drawGrid(ctx);

    // Draw axes labels
    drawAxesLabels(ctx);

    // Get aggregation period and scaling parameters based on time filter
    const aggregationPeriod = getAggregationPeriodForFilter(timeFilter) as TimePeriod;
    const maxHours = getMaxTimeRangeForFilter(timeFilter);
    const minHours = getMinTimeRangeForFilter();

    // Draw all trails with dynamic aggregation and scaling
    const padding = 60;
    drawAllTrails(ctx, markets, hoveredMarketSlug, width, height, padding, aggregationPeriod, maxHours, minHours, optionsFilter);
    }, [drawGrid, drawAxesLabels, width, height, markets, hoveredMarketSlug, timeFilter, optionsFilter]);

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
