import React from 'react';
import Button from './Button';
import { useI18n } from '../../contexts/I18nContext';

interface CardProps {
  title: string;
  description: string;
  onOpen: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onOpen }) => {
  const { t } = useI18n();
  return (
    <div className="bg-surface border border-border rounded-lg p-6 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-md hover:shadow-accent/20">
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary flex-grow mb-4">{description}</p>
      <div className="mt-auto">
        <Button onClick={onOpen} className="w-full">
          {t('buttons.openCalculator')}
        </Button>
      </div>
    </div>
  );
};

export default Card;