import { useTranslations } from 'next-intl';

export function PremarketTableHeader() {
  const t = useTranslations('premarkets');

  return (
    <div className="bg-muted px-3 py-2 border-b border-border">
      <div className="grid grid-cols-12 gap-4 items-center text-xs font-mono font-medium text-muted-foreground">
        {/* Market Column */}
        <div className="col-span-8 flex items-center gap-2 justify-start pr-8">
          <span>{t('market')}</span>
        </div>

        {/* Funding Column */}
        <div className="col-span-2 flex items-center gap-2 justify-center">
          <span>{t('funding')}</span>
        </div>

        {/* Deadline Column */}
        <div className="col-span-2 flex items-center gap-2 justify-center">
          <span>{t('deadline')}</span>
        </div>
      </div>
    </div>
  );
}
