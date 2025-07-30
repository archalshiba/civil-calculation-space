

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ResultsPanel from '../ui/ResultsPanel';
import { StripFootingSVG } from '../icons/SVGSchematics';
import { calculateStripFooting } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface StripFootingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    depth: 400, // Thickness
    depthUnit: 'mm',
    width: 800, // Width
    widthUnit: 'mm',
    length: 10,
    lengthUnit: 'm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    mainBarSize: '12mm', // Transverse
    mainBarSpacing: 200,
    mainBarSpacingUnit: 'mm',
    tempBarSize: '12mm', // Longitudinal
    tempBarSpacing: 250,
    tempBarSpacingUnit: 'mm',
};

const imperialDefaults: CalculationInputs = {
    depth: 16,
    depthUnit: 'in',
    width: 32,
    widthUnit: 'in',
    length: 30,
    lengthUnit: 'ft',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    mainBarSize: '#4',
    mainBarSpacing: 8,
    mainBarSpacingUnit: 'in',
    tempBarSize: '#4',
    tempBarSpacing: 10,
    tempBarSpacingUnit: 'in',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const StripFootingCalculatorModal: React.FC<StripFootingCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  
  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.depth || currentInputs.depth <= 0) newErrors.depth = t('errors.positiveNumber');
      if (!currentInputs.width || currentInputs.width <= 0) newErrors.width = t('errors.positiveNumber');
      if (!currentInputs.length || currentInputs.length <= 0) newErrors.length = t('errors.positiveNumber');
      if (!currentInputs.mainBarSpacing || currentInputs.mainBarSpacing <= 0) newErrors.mainBarSpacing = t('errors.positiveNumber');
      if (!currentInputs.tempBarSpacing || currentInputs.tempBarSpacing <= 0) newErrors.tempBarSpacing = t('errors.positiveNumber');

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
      calculationFn: calculateStripFooting,
      validationFn: validateInputs,
  });

  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.footingGeometry')}</h3>
        <Input 
            label={t('inputs.labels.width')} type="number"
            value={inputs.width || ''} onChange={e => handleInputChange('width', parseFloat(e.target.value))}
            unit={inputs.widthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('widthUnit', u)}
            error={errors.width}
        />
        <Input 
            label={t('inputs.labels.thickness')} type="number"
            value={inputs.depth || ''} onChange={e => handleInputChange('depth', parseFloat(e.target.value))}
            unit={inputs.depthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('depthUnit', u)}
            error={errors.depth}
        />
        <Input 
            label={t('inputs.labels.length')} type="number"
            value={inputs.length || ''} onChange={e => handleInputChange('length', parseFloat(e.target.value))}
            unit={inputs.lengthUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('lengthUnit', u)}
            error={errors.length}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <StripFootingSVG />
      </div>
    </div>
  );

  const ReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.mainReinf')} (Transverse)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.mainBarSize} onChange={e => handleInputChange('mainBarSize', e.target.value)}
                >
                    <option value="12mm">12 mm</option><option value="16mm">16 mm</option><option value="#4">#4</option><option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacing')} type="number"
                    value={inputs.mainBarSpacing || ''} onChange={e => handleInputChange('mainBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.mainBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('mainBarSpacingUnit', u)}
                    error={errors.mainBarSpacing}
                />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.tempReinf')} (Longitudinal)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.tempBarSize} onChange={e => handleInputChange('tempBarSize', e.target.value)}
                >
                    <option value="10mm">10 mm</option><option value="12mm">12 mm</option><option value="#4">#4</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacing')} type="number"
                    value={inputs.tempBarSpacing || ''} onChange={e => handleInputChange('tempBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.tempBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('tempBarSpacingUnit', u)}
                    error={errors.tempBarSpacing}
                />
            </div>
        </div>
    </div>
  );

  const tabs = [
    { label: t('tabs.geometry'), content: <GeometryTab /> },
    { label: t('tabs.reinforcement'), content: <ReinforcementTab /> },
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

export default StripFootingCalculatorModal;