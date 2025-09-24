import { useTranslations } from 'next-intl';

interface MarketOptionsProps {
  options: string[];
  cas?: {
    [key: string]: {
      tokenMint: string;
      poolAddress: string;
      currentPrice?: number;
    };
  };
}

function normalize(prices: number[]): [number, number] {
  const a = prices[0]
  const b = prices[1]
  if (a === 0 && b === 0) { return [0, 0] }

  function leadingZeros(n: number): number {
    const str = n.toString()
    const match = str.match(/^0\.(0*)[1-9]/)
    return match ? match[1].length : 0
  }

  const zeros = Math.min(leadingZeros(a), leadingZeros(b))

  const scale = Math.pow(10, zeros + 2)
  const fa = parseFloat((a * scale).toFixed(2))
  const fb = parseFloat((b * scale).toFixed(2))

  return [fa, fb]
}

export function MarketOptions({ options, cas }: MarketOptionsProps) {
  const t = useTranslations('markets.options');
  let displayOptions = options.length >= 2 ? options.slice(0, 2) : [t('yes'), t('no')];

  if (displayOptions.includes(t('yes')) && displayOptions.includes(t('no'))) {
    displayOptions = [t('yes'), t('no')];
  }
  const getOptionColor = (option: string, index: number) => {
    return index === 0
      ? 'bg-success/20 text-success hover:bg-success/30'
      : 'bg-destructive/20 text-destructive hover:bg-destructive/30';
  };

  const getOptionPrice = (option: string) => {
    if (!cas) { return 0; }
    const caseData = cas[option];
    return caseData?.currentPrice || 0;
  };

  const normalizedPrices = normalize(displayOptions.map(option => getOptionPrice(option)));

  return (
    <div className="grid grid-cols-2 gap-1 w-full max-w-24">
      {/* Options Row */}
      <div className="col-span-2 grid grid-cols-2 gap-1">
        {displayOptions.map((option, index) => (
          <button
            key={`option-${index}`}
            className={`px-1 py-0.5 text-xs font-mono font-medium rounded transition-colors ${getOptionColor(option, index)}`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Prices Row */}
      <div className="col-span-2 grid grid-cols-2 gap-1">
        {displayOptions.map((option, index) => {
          const price = getOptionPrice(option);
          return (
            <div key={`price-${index}`} className="text-center">
              {price ? (
                <div className="text-xs text-muted-foreground font-mono">
                  {normalizedPrices[index]}%
                </div>
              ) : (
                <div className="text-xs text-muted-foreground font-mono">
                  {t('na')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
