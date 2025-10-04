interface PremarketFundingBarProps {
  balance: number;
  limit: number;
  fundingProgress: number;
}

export function PremarketFundingBar({ balance, limit, fundingProgress }: PremarketFundingBarProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  return (
    <div className="flex flex-col items-center gap-1 w-32">
      {/* Balance and limit display */}
      <div className="text-xs text-orange-500 font-medium">
        ${formatNumber(balance)} / ${formatNumber(limit)}
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, fundingProgress))}%` }}
        />
      </div>
      
      {/* Progress percentage */}
      <div className="text-xs text-muted-foreground font-mono">
        {fundingProgress.toFixed(1)}%
      </div>
    </div>
  );
}
