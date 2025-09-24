import { ArrowUp, ArrowDown } from 'lucide-react';

interface MarketPriceProps {
  price: number;
  priceChange: number;
}

export function MarketPrice({ price, priceChange }: MarketPriceProps) {
  const isPositive = priceChange >= 0;
  const isPricePositive = price >= 0;
  
  const formatPrice = (value: number) => {
    return `$${value.toFixed(3)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div>
      <div className={`text-xs font-medium ${isPricePositive ? 'text-foreground' : 'text-destructive'}`}>
        {formatPrice(price)}
      </div>
      <div className={`text-xs flex items-center gap-1 ${
        isPositive ? 'text-success' : 'text-destructive'
      }`}>
        {isPositive ? (
          <ArrowUp className="w-3 h-3" />
        ) : (
          <ArrowDown className="w-3 h-3" />
        )}
        {formatPercentage(priceChange)}
      </div>
    </div>
  );
}
