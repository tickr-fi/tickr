import { useTranslations } from 'next-intl';
import { Dropdown, DropdownOption } from '@/components/ui';
import { Clock, Clock12, SortAsc, DollarSign, TrendingUp, ArrowUpDown } from 'lucide-react';

export type SortOption = 'expiringSoon' | 'expiringLater' | 'alphabetical' | 'highestLiquidity' | 'highestVolume';

interface MarketSortingDropdownProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function MarketSortingDropdown({ selectedSort, onSortChange }: MarketSortingDropdownProps) {
  const t = useTranslations('markets.sorting');

  const sortOptions: DropdownOption[] = [
    { key: 'expiringSoon', label: t('expiringSoon'), icon: Clock },
    { key: 'expiringLater', label: t('expiringLater'), icon: Clock12 },
    { key: 'alphabetical', label: t('alphabetical'), icon: SortAsc },
    { key: 'highestLiquidity', label: t('highestLiquidity'), icon: DollarSign },
    { key: 'highestVolume', label: t('highestVolume'), icon: TrendingUp },
  ];

  return (
    <div className="inline-flex bg-secondary rounded-md p-0.5">
      <Dropdown
        options={sortOptions}
        selectedOption={selectedSort}
        onOptionChange={(key) => onSortChange(key as SortOption)}
        className="w-38"
        variant="secondary"
        triggerIcon={() => <ArrowUpDown className="w-3 h-3" />}
      />
    </div>
  );
}
