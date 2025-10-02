import { useTranslations } from 'next-intl';
import { useMarketOptionsStore } from '@/stores';
import { Percent, DollarSign } from 'lucide-react';

export function OptionsViewMode() {
  const t = useTranslations('markets.optionsViewMode');
  const { optionsViewMode, setOptionsViewMode } = useMarketOptionsStore();

  const handleToggle = () => {
    setOptionsViewMode(optionsViewMode === 'odds' ? 'prices' : 'odds');
  };

  return (
    <div className="inline-flex bg-secondary rounded-md p-0.5">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1 px-2 py-1.5 text-xs font-mono
          font-medium transition-all duration-200 rounded-sm cursor-pointer ${'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        title={optionsViewMode === 'prices' ? t('prices') : t('odds')}
      >
        {optionsViewMode === 'prices' ? (
          <>
            <DollarSign className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('prices')}</span>
          </>
        ) : (
          <>
            <Percent className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('odds')}</span>
          </>
        )}
      </button>
    </div>
  );
}
