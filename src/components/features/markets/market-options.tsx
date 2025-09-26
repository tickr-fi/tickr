import { useTableOptionsStore } from '@/stores';
import { calculateMarketOptionValues } from '@/lib/market-utils';
import { Tooltip } from '@/components/ui';

interface MarketOptionsProps {
  options: string[];
  cas?: {
    [key: string]: {
      tokenMint: string;
      poolAddress: string;
      name?: string;
      currentPrice?: number;
      change24h?: number;
    };
  };
}

export function MarketOptions({ options, cas }: MarketOptionsProps) {
  const { optionsViewMode } = useTableOptionsStore();

  const {
    displayOptions: calculatedDisplayOptions,
    displayNames,
    formattedValues,
    optionColors,
    formattedChange,
    changeColor,
  } = calculateMarketOptionValues(options, cas, optionsViewMode);

  return (
    <div className="flex flex-col gap-1 w-full max-w-40">
      <div className="grid grid-cols-2 gap-1">
        {calculatedDisplayOptions.map((option, index) => {
          const tokenMint = cas?.[option]?.tokenMint;
          const optionName = displayNames[index] || option;

          const handleClick = () => {
            if (tokenMint) {
              window.open(`https://jup.ag/tokens/${tokenMint}`, '_blank');
            }
          };

          return (
            <Tooltip
              key={`option-${index}`}
              content={optionName}
              side="top"
              delayDuration={200}
            >
              <button
                onClick={handleClick}
                className={`px-2 py-0.5 text-xs font-mono font-medium rounded transition-colors 
                  cursor-pointer whitespace-nowrap ${optionColors[index]}`}
              >
                {formattedValues[index]}
              </button>
            </Tooltip>
          );
        })}
      </div>

      <div className="text-center">
        {formattedChange ? (
          <div className={`text-[10px] font-mono ${changeColor} whitespace-nowrap`}>
            {formattedChange}
          </div>
        ) : null}
      </div>
    </div>
  );
}
