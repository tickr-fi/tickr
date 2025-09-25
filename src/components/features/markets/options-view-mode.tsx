import { useTranslations } from 'next-intl';
import { useTableOptionsStore } from '@/stores';

export function OptionsViewMode() {
  const t = useTranslations('markets.optionsViewMode');
  const { optionsViewMode, setOptionsViewMode } = useTableOptionsStore();

  const handleToggle = () => {
    setOptionsViewMode(optionsViewMode === 'odds' ? 'prices' : 'odds');
  };

  const buttonClasses = 'px-2 py-1 text-xs font-mono font-medium transition-colors rounded cursor-pointer ' +
    'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground';

  return (
    <button
      onClick={handleToggle}
      className={buttonClasses}
    >
      {optionsViewMode === 'prices' ? t('prices') : t('odds')}
    </button>
  );
}
