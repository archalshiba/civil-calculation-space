

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import ResultsPanel from '../ui/ResultsPanel';
import { BracketCorbelSVG } from '../icons/SVGSchematics';
import { calculateBracketCorbel } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface BracketCorbelCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    effectiveDepth: 400,
    effectiveDepthUnit: 'mm',
    shearSpan: 200,
    shearSpanUnit: 'mm',
    appliedLoad: 150,
    appliedLoadUnit: 'kN',
    width: 300,
    widthUnit: 'mm',
    concreteStrength: 25,
    concreteStrengthUnit: 'MPa',
    steelYieldStrength: 420,
    steelYieldStrengthUnit: 'MPa',
};

const imperialDefaults: CalculationInputs = {
    effectiveDepth: 16,
    effectiveDepthUnit: 'in',
    shearSpan: 8,
    shearSpanUnit: 'in',
    appliedLoad: 35,
    appliedLoadUnit: 'kip',
    width: 12,
    widthUnit: 'in',
    concreteStrength: 4000,
    concreteStrengthUnit: 'psi',
    steelYieldStrength: 60,
    steelYieldStrengthUnit: 'ksi',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const BracketCorbelCalculatorModal: React.FC<BracketCorbelCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  
  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.effectiveDepth || currentInputs.effectiveDepth <= 0) newErrors.effectiveDepth = t('errors.positiveNumber');
      if (!currentInputs.shearSpan || currentInputs.shearSpan <= 0) newErrors.shearSpan = t('errors.positiveNumber');
      if (!currentInputs.appliedLoad || currentInputs.appliedLoad <= 0) newErrors.appliedLoad = t('errors.positiveNumber');
      if (!currentInputs.width || currentInputs.width <= 0) newErrors.width = t('errors.positiveNumber');
      if ((currentInputs.shearSpan && currentInputs.effectiveDepth) && (currentInputs.shearSpan / currentInputs.effectiveDepth) > 1.0) newErrors.shearSpan = t('errors.avdRatio');
      return newErrors;
  }

  const {
      inputs, results, errors, isCalculating,
      handleInputChange, handleUnitChange,
      handleCalculate, handleClear, handleAddToProject, handleCloseAndClear,
  } = useCalculatorForm<CalculationInputs, CalculationResults>({
      calculatorTitle: title,
      isOpen,
      onClose,
      initialInputs: getDefaultInputs(),
      calculationFn: calculateBracketCorbel,
      validationFn: validateInputs,
  });

  const GeometryLoadsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.geometryLoadsMaterials')}</h3>
        <Input 
            label={t('inputs.labels.effectiveDepth')} type="number"
            value={inputs.effectiveDepth || ''} onChange={e => handleInputChange('effectiveDepth', parseFloat(e.target.value))}
            unit={inputs.effectiveDepthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('effectiveDepthUnit', u)}
            error={errors.effectiveDepth}
        />
        <Input 
            label={t('inputs.labels.shearSpan')} type="number"
            value={inputs.shearSpan || ''} onChange={e => handleInputChange('shearSpan', parseFloat(e.target.value))}
            unit={inputs.shearSpanUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('shearSpanUnit', u)}
            error={errors.shearSpan}
        />
        <Input 
            label={t('inputs.labels.factoredLoad')} type="number"
            value={inputs.appliedLoad || ''} onChange={e => handleInputChange('appliedLoad', parseFloat(e.target.value))}
            unit={inputs.appliedLoadUnit} units={['kN', 'kip']} onUnitChange={u => handleUnitChange('appliedLoadUnit', u)}
            error={errors.appliedLoad}
        />
        <Input 
            label={t('inputs.labels.bracketWidth')} type="number"
            value={inputs.width || ''} onChange={e => handleInputChange('width', parseFloat(e.target.value))}
            unit={inputs.widthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('widthUnit', u)}
            error={errors.width}
        />
        <Input 
            label={t('inputs.labels.concreteStrength')} type="number"
            value={inputs.concreteStrength || ''} onChange={e => handleInputChange('concreteStrength', parseFloat(e.target.value))}
            unit={inputs.concreteStrengthUnit} units={['MPa', 'psi']} onUnitChange={u => handleUnitChange('concreteStrengthUnit', u)}
        />
        <Input 
            label={t('inputs.labels.yieldStrength')} type="number"
            value={inputs.steelYieldStrength || ''} onChange={e => handleInputChange('steelYieldStrength', parseFloat(e.target.value))}
            unit={inputs.steelYieldStrengthUnit} units={['MPa', 'ksi']} onUnitChange={u => handleUnitChange('steelYieldStrengthUnit', u)}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg min-h-[200px]">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.strutAndTie')}</p>
        <BracketCorbelSVG />
      </div>
    </div>
  );

  const ReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.mainTensionReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input label={t('inputs.labels.requiredSteelAreaAsc')} type="text" readOnly value={results?.mainSteelArea ?? '...'} className="!bg-surface-secondary/50" />
                <Select label={t('inputs.labels.provideBarSize')}><option>16 mm</option><option>20 mm</option></Select>
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.hangerReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input label={t('inputs.labels.requiredSteelAreaAh')} type="text" readOnly value={results?.hangerSteelArea ?? '...'} className="!bg-surface-secondary/50" />
                 <Select label={t('inputs.labels.provideStirrupSize')}><option>10 mm</option><option>12 mm</option></Select>
                 <Input label={t('inputs.labels.numStirrupLegs')} type="number" defaultValue="2"/>
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.checksAndOptions')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input 
                    label="av/d Ratio" 
                    type="text" 
                    value={(inputs.shearSpan && inputs.effectiveDepth) ? (inputs.shearSpan / inputs.effectiveDepth).toFixed(2) : '...'} 
                    readOnly className="!bg-surface-secondary/50" 
                />
                 <Checkbox label={t('inputs.labels.useStrutAndTie')} defaultChecked />
            </div>
        </div>
    </div>
);

  const tabs = [
    { label: t('tabs.geometryAndLoads'), content: <GeometryLoadsTab /> },
    { label: t('tabs.reinfDetails'), content: <ReinforcementTab /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAndClear} title={title}>
      {results ? (
        <ResultsPanel results={results} onClear={handleClear} onAddToProject={handleAddToProject}/>
      ) : (
        <>
          <Tabs tabs={tabs} />
          <footer className="mt-8 pt-6 border-t border-border flex justify-end space-x-4">
            <Button variant="secondary" onClick={handleClear}>{t('buttons.clear')}</Button>
            <Button variant="primary" onClick={handleCalculate} loading={isCalculating}>{t('buttons.calculate')}</Button>
          </footer>
        </>
      )}
    </Modal>
  );
};

export default BracketCorbelCalculatorModal;