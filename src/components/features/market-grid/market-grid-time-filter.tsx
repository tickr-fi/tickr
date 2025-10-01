'use client';

import React from 'react';

export type TimeFilter = '<1h' | '<24h' | '<7d' | '<30d' | 'All';

interface MarketGridTimeFilterProps {
  selectedFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

const timeFilterOptions: { value: TimeFilter; label: string }[] = [
  { value: '<1h', label: '<1h' },
  { value: '<24h', label: '<24h' },
  { value: '<7d', label: '<7d' },
  { value: '<30d', label: '<30d' },
  { value: 'All', label: 'All' }
];

export function MarketGridTimeFilter({ selectedFilter, onFilterChange }: MarketGridTimeFilterProps) {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex bg-secondary rounded-md p-0.5 shadow-lg">
        {timeFilterOptions.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`
              px-2 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer
              relative
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
    </div>
  );
}
