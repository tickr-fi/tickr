'use client';

import React from 'react';
import { Market } from '@/lib/types';
  import { calculateMarketOptionValues } from '@/lib/utils/market-utils';
import { useTableOptionsStore } from '@/stores';

interface MarketGridCardOptionsProps {
  market: Market;
}

export function MarketGridCardOptions({ market }: MarketGridCardOptionsProps) {
  const { optionsViewMode } = useTableOptionsStore();
  
  const {
    displayOptions,
    displayNames,
    formattedValues,
    formattedChange,
    changeColor
  } = calculateMarketOptionValues(market.options, optionsViewMode);

  return (
    <div className="p-4 border-b border-border">
      <div className="flex gap-2">
        {displayOptions.map((option, index) => {
          const optionName = displayNames[index] || option;
          const tokenMint = (market.cas as any)?.[option]?.tokenMint;
          const isYesOption = option.toUpperCase().includes('YES');

          const handleOptionClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (tokenMint) {
              window.open(`https://jup.ag/tokens/${tokenMint}`, '_blank');
            }
          };
          
          return (
            <button
              key={option}
              onClick={handleOptionClick}
              className={`flex-1 py-2 px-3 rounded-lg text-center transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-md ${
                isYesOption 
                  ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isYesOption ? 'text-green-500' : 'text-red-500'}`}>
                {optionName}
              </div>
              <div className={`text-xl font-bold ${isYesOption ? 'text-green-500' : 'text-red-500'}`}>
                {formattedValues[index] || '0%'}
              </div>
            </button>
          );
        })}
      </div>

      {formattedChange && (
        <div className="text-center mt-3">
          <div className={`text-xs font-mono ${changeColor}`}>
            {formattedChange}
          </div>
        </div>
      )}
    </div>
  );
}
