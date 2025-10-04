import { useTranslations } from 'next-intl';
import { Dropdown, DropdownOption } from '@/components/ui';
import { Clock, Clock12, SortAsc, DollarSign, TrendingUp, ArrowUpDown, Layers } from 'lucide-react';
import { usePremarketOptionsStore } from '@/stores';

export function PremarketSortingDropdown() {
  const t = useTranslations('premarkets.sorting');
  const { selectedSort, setSelectedSort } = usePremarketOptionsStore();

  const sortOptions: DropdownOption[] = [
    { key: 'expiringSoon', label: t('expiringSoon'), icon: Clock },
    { key: 'expiringLater', label: t('expiringLater'), icon: Clock12 },
    { key: 'alphabetical', label: t('alphabetical'), icon: SortAsc },
    { key: 'liquidity', label: t('liquidity'), icon: DollarSign },
    { key: 'funding', label: t('funding'), icon: Layers },
    { key: 'progress', label: t('progress'), icon: TrendingUp },
  ];

  return (
    <div className="inline-flex bg-secondary rounded-md p-0.5">
      <Dropdown
        options={sortOptions}
        selectedOption={selectedSort}
        onOptionChange={(key) => setSelectedSort(key as typeof selectedSort)}
        className="w-38"
        variant="secondary"
        triggerIcon={() => <ArrowUpDown className="w-3 h-3" />}
      />
    </div>
  );
}
