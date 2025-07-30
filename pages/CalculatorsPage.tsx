import React, { useState } from 'react';
import { CALCULATORS_DATA } from '../constants';
import type { CalculatorSection, CalculatorInfo } from '../types';
import Card from '../components/ui/Card';
import { useI18n } from '../contexts/I18nContext';

const CalculatorsPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { t } = useI18n();

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">{t('calculators.pageTitle')}</h1>
      <p className="text-text-secondary mb-8">{t('calculators.pageSubtitle')}</p>
      
      <div className="space-y-12">
        {CALCULATORS_DATA.map((section: CalculatorSection) => (
          <div key={section.titleKey}>
            <h2 className="text-2xl font-semibold text-text-primary border-b-2 border-primary/50 pb-2 mb-6">
              {t(section.titleKey)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.calculators.map((calc: CalculatorInfo) => {
                const ModalComponent = calc.modalComponent;
                const translatedTitle = t(calc.titleKey);
                return (
                  <React.Fragment key={calc.id}>
                    <Card
                      title={translatedTitle}
                      description={t(calc.descriptionKey)}
                      onOpen={() => openModal(calc.id)}
                    />
                    {ModalComponent && (
                      <ModalComponent
                        isOpen={activeModal === calc.id}
                        onClose={closeModal}
                        title={translatedTitle}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorsPage;