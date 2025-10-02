'use client';

import React, { useEffect, useRef } from 'react';
import { Market } from '@/lib/types';
import { MarketGridCard } from './market-grid-card';
import { useResponsiveViewMode } from '@/hooks/useResponsiveViewMode';

interface MarketGridHoverTooltipProps {
  market: Market;
  x: number;
  y: number;
  size: number;
  visible: boolean;
  isPinned?: boolean;
  onClose?: () => void;
  highlightedOptionType?: 'YES' | 'NO';
}

export function MarketGridHoverTooltip({
  market, x, y, size, visible, isPinned = false, onClose, highlightedOptionType
}: MarketGridHoverTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { isLargeScreen } = useResponsiveViewMode();

  // Handle click outside to close pinned tooltip
  useEffect(() => {
    if (!isPinned || !onClose) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPinned, onClose]);

  if (!visible) {
    return null;
  }

  // Calculate tooltip position
  const tooltipWidth = 320;
  const tooltipHeight = 500;
  const padding = 20;

  let tooltipX, tooltipY;
  const isMobile = !isLargeScreen;

  if (isMobile) {
    // When pinned (clicked) on mobile, always center the tooltip
    tooltipX = (window.innerWidth - tooltipWidth) / 2;
    tooltipY = (window.innerHeight - tooltipHeight) / 2;
  } else {
    // When hovering or pinned on desktop, position relative to the point
    const marginFromPoint = 30;
    tooltipX = x + (size / 2) + marginFromPoint; // Dynamic offset based on point size
    tooltipY = y - tooltipHeight / 2;

    // Adjust if tooltip would go off the right edge
    if (tooltipX + tooltipWidth > window.innerWidth - padding) {
      tooltipX = x - tooltipWidth - 20; // Show to the left instead
    }

    // Adjust if tooltip would go off the top edge
    if (tooltipY < padding) {
      tooltipY = padding;
    }

    // Adjust if tooltip would go off the bottom edge
    if (tooltipY + tooltipHeight > window.innerHeight - padding) {
      tooltipY = window.innerHeight - tooltipHeight - padding;
    }
  }

  return (
    <div
      ref={tooltipRef}
      className={`fixed z-50 ${isPinned ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{
        left: `${tooltipX}px`,
        top: `${tooltipY}px`,
      }}
    >
      <MarketGridCard market={market} onClose={onClose} highlightedOptionType={highlightedOptionType} />
    </div>
  );
}
