import { useTranslations } from 'next-intl';
import { Dropdown, DropdownOption } from '@/components/ui';

export type SortOption = 'expiringSoon' | 'expiringLater' | 'alphabetical' | 'highestLiquidity' | 'highestVolume';

interface MarketSortingDropdownProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function MarketSortingDropdown({ selectedSort, onSortChange }: MarketSortingDropdownProps) {
  const t = useTranslations('markets.sorting');

  const sortOptions: DropdownOption[] = [
    { key: 'expiringSoon', label: t('expiringSoon') },
    { key: 'expiringLater', label: t('expiringLater') },
    { key: 'alphabetical', label: t('alphabetical') },
    { key: 'highestLiquidity', label: t('highestLiquidity') },
    { key: 'highestVolume', label: t('highestVolume') },
  ];

  return (
    <Dropdown
      options={sortOptions}
      selectedOption={selectedSort}
      onOptionChange={(key) => onSortChange(key as SortOption)}
      className="w-36"
      variant="muted"
    />
  );
}
