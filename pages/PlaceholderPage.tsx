import React from 'react';
import { useI18n } from '../contexts/I18nContext';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-surface p-12 rounded-lg border border-border shadow-lg">
        <h1 className="text-4xl font-bold text-text-primary mb-4">{title}</h1>
        <p className="text-lg text-text-secondary">{t('placeholder.underConstruction')}</p>
        <p className="text-md text-text-secondary/80 mt-2">{t('placeholder.checkBack')}</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;