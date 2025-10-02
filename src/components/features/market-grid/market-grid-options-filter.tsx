'use client';

import React from 'react';
import { type GridOptionsFilter } from '@/stores';

interface MarketGridOptionsFilterProps {
  selectedFilter: GridOptionsFilter;
  onFilterChange: (filter: GridOptionsFilter) => void;
}

const optionsFilterOptions: { value: GridOptionsFilter; label: string }[] = [
  { value: 'BOTH', label: 'BOTH' },
  { value: 'YES', label: 'YES' },
  { value: 'NO', label: 'NO' },
  { value: 'WINNER', label: 'WINNER' }
];

export function MarketGridOptionsFilter({ selectedFilter, onFilterChange }: MarketGridOptionsFilterProps) {
  return (
    <div className="flex bg-secondary rounded-md p-0.5 shadow-lg">
      {optionsFilterOptions.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`
            px-3 py-1.5 lg:px-2 lg:py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer
            relative min-w-[87.5px] lg:min-w-0
            ${
              selectedFilter === option.value
                ? 'bg-primary text-primary-foreground'
                : 'text-secondary-foreground hover:text-foreground hover:bg-secondary/60'
            }
            ${
              index === 0 
                ? 'rounded-l-sm' 
                : index === optionsFilterOptions.length - 1 
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
