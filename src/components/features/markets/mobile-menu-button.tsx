'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useTableOptionsStore } from '@/stores';

export function MobileMenuButton() {
  const { showMobileMenu, setShowMobileMenu, setShowAdvancedFilters } = useTableOptionsStore();

  const toggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowAdvancedFilters(false);
  };

  return (
    <button
      onClick={toggleMenu}
      className="p-2 hover:bg-muted rounded transition-colors cursor-pointer"
    >
      {showMobileMenu ? (
        <X className="w-4 h-4 text-foreground" />
      ) : (
        <SlidersHorizontal className="w-4 h-4 text-foreground" />
      )}
    </button>
  );
}
