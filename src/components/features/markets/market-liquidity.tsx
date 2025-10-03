interface MarketLiquidityProps {
  limit?: number;
  maxLiquidity?: number;
}

export function MarketLiquidity({ limit, maxLiquidity = 100000 }: MarketLiquidityProps) {
  
  if (!limit) {
    return <div className="text-xs text-muted-foreground">--</div>;
  }

  const percentage = Math.min(100, (limit / maxLiquidity) * 100);

  return (
    <div className="flex flex-col items-center gap-1 w-32">
      <div className="text-xs text-orange-500 font-medium">
        ${limit.toLocaleString()}
      </div>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
