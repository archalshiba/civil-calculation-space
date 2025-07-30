import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useI18n } from '../../contexts/I18nContext';

interface PlaceholderCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const PlaceholderCalculatorModal: React.FC<PlaceholderCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.titles.unavailable')}>
      <div className="text-center p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-4">{t('placeholder.underConstruction')}</h3>
        <p className="text-text-secondary mb-6">
          {t('placeholder.inDevelopment')}
        </p>
        <Button onClick={onClose}>{t('buttons.close')}</Button>
      </div>
    </Modal>
  );
};

export default PlaceholderCalculatorModal;