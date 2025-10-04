'use client';

import { useGlobalLoadingStore } from '@/stores';
import { Loader2 } from 'lucide-react';

interface GlobalLoaderProps {
  children: React.ReactNode;
}

export function GlobalLoader({ children }: GlobalLoaderProps) {
  const { isLoading } = useGlobalLoadingStore();

  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-mono text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
