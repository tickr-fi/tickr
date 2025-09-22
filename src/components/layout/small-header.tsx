'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SmallHeader() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-background border-b border-border/50 px-2 py-0">
      <div className="flex items-center justify-between h-6">
        <div className="text-[10px] text-small-header-text font-mono">
          PMX.MARKETS TERMINAL v1.0.0
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-small-header-text font-mono">
          {mounted && currentTime && (
            <>
              <Clock className="w-2.5 h-2.5" />
              <span>{formatTime(currentTime)} | {formatDate(currentTime)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
