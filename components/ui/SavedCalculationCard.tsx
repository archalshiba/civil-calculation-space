
import React from 'react';
import type { SavedCalculationItem } from '../../types';
import Button from './Button';
import { TrashIcon, DocumentTextIcon } from '../icons/Icons';
import { useI18n } from '../../contexts/I18nContext';

interface SavedCalculationCardProps {
  item: SavedCalculationItem;
  onDelete: (id: string, description: string) => void;
  onViewDetails: (item: SavedCalculationItem) => void;
}

const SavedCalculationCard: React.FC<SavedCalculationCardProps> = ({ item, onDelete, onViewDetails }) => {
  const { t } = useI18n();

  return (
    <div className="bg-surface border border-border rounded-lg p-6 animate-fade-in-up">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-accent">{item.type}</p>
          <h3 className="text-xl font-bold text-text-primary mb-1">{item.description}</h3>
          <p className="text-xs text-text-secondary/80">
            {t('projects.savedOn', { date: new Date(item.timestamp).toLocaleString() })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="secondary" onClick={() => onViewDetails(item)} className="!p-2">
                <DocumentTextIcon className="h-5 w-5"/>
                <span className="sr-only">{t('buttons.viewDetails')}</span>
            </Button>
            <Button variant="danger" onClick={() => onDelete(item.id, item.description)} className="!p-2">
                <TrashIcon className="h-5 w-5"/>
                <span className="sr-only">{t('buttons.delete')}</span>
            </Button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50">
        <h4 className="text-md font-semibold text-text-secondary mb-2">{t('projects.keyResults')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-surface-secondary/30 p-2 rounded-md">
            <p className="text-text-secondary">{t('resultsKeys.concreteVolume')}</p>
            <p className="font-semibold text-text-primary">{item.results.concreteVolume}</p>
          </div>
          <div className="bg-surface-secondary/30 p-2 rounded-md">
            <p className="text-text-secondary">{t('resultsKeys.formworkArea')}</p>
            <p className="font-semibold text-text-primary">{item.results.formworkArea}</p>
          </div>
          <div className="bg-surface-secondary/30 p-2 rounded-md">
            <p className="text-text-secondary">{t('resultsKeys.totalSteelWeight')}</p>
            <p className="font-semibold text-text-primary">{item.results.totalSteelWeight}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedCalculationCard;