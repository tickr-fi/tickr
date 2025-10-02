'use client';

import React from 'react';
import { Market } from '@/lib/types';
import { calculateMarketOptionValues, formatChange24h, getChangeColor } from '@/lib/utils/market-utils';
import { useMarketOptionsStore } from '@/stores';

interface MarketGridCardOptionsProps {
  market: Market;
  highlightedOptionType?: 'YES' | 'NO';
}

export function MarketGridCardOptions({ market, highlightedOptionType }: MarketGridCardOptionsProps) {
  const { optionsViewMode } = useMarketOptionsStore();

  const {
    displayOptions,
    displayNames,
    formattedValues
  } = calculateMarketOptionValues(market.options, optionsViewMode);

  const yesChange = market.options.YES?.change24h;
  const noChange = market.options.NO?.change24h;
  const yesFormattedChange = formatChange24h(yesChange);
  const noFormattedChange = formatChange24h(noChange);
  const yesChangeColor = getChangeColor(yesChange);
  const noChangeColor = getChangeColor(noChange);

  return (
    <div className="p-4 border-b border-border">
      <div className="flex gap-2">
        {displayOptions.map((option, index) => {
          const optionName = displayNames[index] || option;
          const tokenMint = (market.cas as any)?.[option]?.tokenMint;
          const isYesOption = option.toUpperCase().includes('YES');
          const formattedChange = isYesOption ? yesFormattedChange : noFormattedChange;
          const changeColor = isYesOption ? yesChangeColor : noChangeColor;

          const handleOptionClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (tokenMint) {
              window.open(`https://jup.ag/tokens/${tokenMint}`, '_blank');
            }
          };

          const isHighlighted = highlightedOptionType && (
            (highlightedOptionType === 'YES' && isYesOption) ||
            (highlightedOptionType === 'NO' && !isYesOption)
          );

          return (
            <button
              key={option}
              onClick={handleOptionClick}
              className={`flex-1 py-2 px-3 rounded-lg text-center transition-all duration-200
                cursor-pointer hover:scale-105 hover:shadow-md ${isYesOption
                  ? `bg-green-500/10 border border-green-500/20 hover:bg-green-500/20
                  ${isHighlighted ? 'bg-green-500/20 border-green-500/40 shadow-lg scale-105' : ''}`
                  : `bg-red-500/10 border border-red-500/20 hover:bg-red-500/20
                  ${isHighlighted ? 'bg-red-500/20 border-red-500/40 shadow-lg scale-105' : ''}`
                }`}
            >
              <div className={`text-sm font-medium mb-1 ${isYesOption ? 'text-green-500' : 'text-red-500'}`}>
                {optionName}
              </div>
              <div className={`text-xl font-bold ${isYesOption ? 'text-green-500' : 'text-red-500'}`}>
                {formattedValues[index] || '0%'}
              </div>
              {formattedChange && (
                <div className={`text-xs font-mono mt-1 ${changeColor}`}>
                  {formattedChange}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
