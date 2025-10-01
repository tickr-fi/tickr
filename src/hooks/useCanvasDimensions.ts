'use client';

import { useEffect, useState, useCallback } from 'react';

interface CanvasDimensions {
  width: number;
  height: number;
}

export function useCanvasDimensions(containerSelector?: string) {
  const [dimensions, setDimensions] = useState<CanvasDimensions>({ width: 800, height: 600 });

  const updateDimensions = useCallback(() => {
    if (containerSelector) {
      const container = document.querySelector(containerSelector) as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
        return;
      }
    }

    // Fallback to window size
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 200 // Header height
    });
  }, [containerSelector]);

  useEffect(() => {
    // Initial setup with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateDimensions, 100);
    
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  return {
    dimensions,
    updateDimensions
  };
}
