import React from 'react';
import Button from './Button';
import { useI18n } from '../../contexts/I18nContext';
import type { CalculationResults } from '../../types';
import { formatInputKey } from '../../utils/ui';

interface ResultsPanelProps {
  results: Partial<CalculationResults>;
  onClear: () => void;
  onAddToProject: () => void;
  isStabilityCheck?: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onClear, onAddToProject, isStabilityCheck = false }) => {
    const { t } = useI18n();

    if (isStabilityCheck) {
        const stabilityResults = {
            factorOfSafetyOverturning: results.factorOfSafetyOverturning,
            factorOfSafetySliding: results.factorOfSafetySliding,
            maxBearingPressure: results.maxBearingPressure,
            minBearingPressure: results.minBearingPressure,
        };
        const materialResults = {
            stemConcreteVolume: results.stemConcreteVolume,
            footingConcreteVolume: results.footingConcreteVolume,
            stemSteelWeight: results.stemSteelWeight,
            footingSteelWeight: results.footingSteelWeight,
        };
        return (
             <div className="animate-fade-in bg-surface-secondary/50 p-6 rounded-lg border border-border">
                <h3 className="text-2xl font-bold text-text-primary mb-4">{t('results.title')}</h3>
                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-primary mb-2">{t('reports.stabilityChecks')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-primary">
                            {Object.entries(stabilityResults).map(([key, value]) => {
                                 if (!value || typeof value !== 'string') return null;
                                 const isFail = value.includes('FAIL') || value.includes('Exceeded');
                                 return (
                                    <div key={key} className="bg-surface/40 p-3 rounded-md">
                                        <p className="text-sm text-text-secondary capitalize">{t(`resultsKeys.${key}`)}</p>
                                        <p className={`text-lg font-semibold ${isFail ? 'text-danger' : 'text-green-400'}`}>{value}</p>
                                    </div>
                                 )
                            })}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-lg font-semibold text-primary mb-2">{t('reports.materialQuantities')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-primary">
                             {Object.entries(materialResults).map(([key, value]) => {
                                if (!value || typeof value !== 'string') return null;
                                return (
                                    <div key={key} className="bg-surface/40 p-3 rounded-md">
                                        <p className="text-sm text-text-secondary capitalize">{t(`resultsKeys.${key}`)}</p>
                                        <p className="text-lg font-semibold">{value}</p>
                                    </div>
                                )
                             })}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <Button variant="primary" onClick={onAddToProject}>{t('buttons.addToProject')}</Button>
                    <Button variant="secondary" onClick={onClear}>{t('buttons.newCalculation')}</Button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in bg-surface-secondary/50 p-6 rounded-lg border border-border">
            <h3 className="text-2xl font-bold text-text-primary mb-4">{t('results.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-primary">
                {Object.entries(results).map(([key, value]) => {
                    if (!value || typeof value !== 'string' || key === 'detailedReinforcement') return null;
                    return (
                        <div key={key} className="bg-surface/40 p-3 rounded-md">
                            <p className="text-sm text-text-secondary capitalize">{t(`resultsKeys.${key}`, { defaultValue: formatInputKey(key) })}</p>
                            <p className="text-lg font-semibold">{value}</p>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between items-center mt-6">
                <Button variant="primary" onClick={onAddToProject}>{t('buttons.addToProject')}</Button>
                <Button variant="secondary" onClick={onClear}>{t('buttons.newCalculation')}</Button>
            </div>
        </div>
    );
};
export default ResultsPanel;
