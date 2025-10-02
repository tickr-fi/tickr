'use client';

import React from 'react';
import { type GridTimeFilter } from '@/stores';

interface MarketGridTimeFilterProps {
  selectedFilter: GridTimeFilter;
  onFilterChange: (filter: GridTimeFilter) => void;
}

const timeFilterOptions: { value: GridTimeFilter; label: string }[] = [
  { value: '<1h', label: '<1h' },
  { value: '<24h', label: '<24h' },
  { value: '<7d', label: '<7d' },
  { value: '<30d', label: '<30d' },
  { value: 'All', label: 'All' }
];

export function MarketGridTimeFilter({ selectedFilter, onFilterChange }: MarketGridTimeFilterProps) {
  return (
    <div className="flex bg-secondary rounded-md p-0.5 shadow-lg">
        {timeFilterOptions.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`
              px-3 py-1.5 lg:px-2 lg:py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer
              relative min-w-[70px] lg:min-w-0
              ${
                selectedFilter === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-secondary-foreground hover:text-foreground hover:bg-secondary/60'
              }
              ${
                index === 0 
                  ? 'rounded-l-sm' 
                  : index === timeFilterOptions.length - 1 
                    ? 'rounded-r-sm' 
                    : ''
              }
              ${
                selectedFilter === option.value
                  ? 'rounded-sm'
                  : ''
              }
            `}
          >
            {option.label}
          </button>
        ))}
    </div>
  );
}
