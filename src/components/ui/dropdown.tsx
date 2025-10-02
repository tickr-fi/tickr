'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedOption: string;
  onOptionChange: (key: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'muted' | 'secondary';
  triggerIcon?: React.ComponentType<{ className?: string }>;
}

export function Dropdown({
  options,
  selectedOption,
  onOptionChange,
  placeholder = 'Select option',
  className = '',
  variant = 'secondary',
  triggerIcon
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptionData = options.find(option => option.key === selectedOption);
  const selectedLabel = selectedOptionData?.label || placeholder;

  const getVariantClasses = () => {
    if (variant === 'muted') {
      return {
        trigger: 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground',
        menu: 'bg-muted',
        option: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      };
    }
    return {
      trigger: 'bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground',
      menu: 'bg-secondary',
      option: 'text-muted-foreground hover:bg-primary hover:text-primary-foreground'
    };
  };

  const variantClasses = getVariantClasses();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (key: string) => {
    onOptionChange(key);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={[
          'flex items-center justify-between gap-2 px-2 py-1.5 text-xs font-mono font-medium',
          'transition-colors rounded cursor-pointer w-full',
          variantClasses.trigger
        ].join(' ')}
      >
        <span>{selectedLabel}</span>
        <div className="flex items-center gap-1">
          {triggerIcon && React.createElement(triggerIcon)}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 border border-border rounded shadow-lg z-50 min-w-full ${variantClasses.menu}`}>
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.key}
                onClick={() => handleOptionClick(option.key)}
                className={[
                  'w-full px-2 py-1 text-xs font-mono font-medium text-left transition-colors',
                  'first:rounded-t last:rounded-b flex items-center gap-2 cursor-pointer',
                  selectedOption === option.key
                    ? 'bg-primary text-primary-foreground'
                    : variantClasses.option
                ].join(' ')}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
