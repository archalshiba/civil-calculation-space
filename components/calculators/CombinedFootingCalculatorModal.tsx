

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ResultsPanel from '../ui/ResultsPanel';
import { CombinedFootingSVG } from '../icons/SVGSchematics';
import { calculateCombinedFooting } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface CombinedFootingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    length: 6.0,
    lengthUnit: 'm',
    width: 2.5,
    widthUnit: 'm',
    depth: 600,
    depthUnit: 'mm',
    span: 4.0, // Re-using span for column spacing
    spanUnit: 'm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    footingBottomBarSize: '20mm',
    footingBottomBarSpacing: 150,
    footingBottomBarSpacingUnit: 'mm',
    footingTopBarSize: '16mm',
    footingTopBarSpacing: 200,
    footingTopBarSpacingUnit: 'mm',
};

const imperialDefaults: CalculationInputs = {
    length: 20,
    lengthUnit: 'ft',
    width: 8,
    widthUnit: 'ft',
    depth: 24,
    depthUnit: 'in',
    span: 12,
    spanUnit: 'ft',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    footingBottomBarSize: '#5',
    footingBottomBarSpacing: 6,
    footingBottomBarSpacingUnit: 'in',
    footingTopBarSize: '#5',
    footingTopBarSpacing: 8,
    footingTopBarSpacingUnit: 'in',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const CombinedFootingCalculatorModal: React.FC<CombinedFootingCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  
  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.length || currentInputs.length <= 0) newErrors.length = t('errors.positiveNumber');
      if (!currentInputs.width || currentInputs.width <= 0) newErrors.width = t('errors.positiveNumber');
      if (!currentInputs.depth || currentInputs.depth <= 0) newErrors.depth = t('errors.positiveNumber');
      if (!currentInputs.span || currentInputs.span <= 0) newErrors.span = t('errors.positiveNumber');
      if (!currentInputs.footingBottomBarSpacing || currentInputs.footingBottomBarSpacing <= 0) newErrors.footingBottomBarSpacing = t('errors.positiveNumber');
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
      calculationFn: calculateCombinedFooting,
      validationFn: validateInputs,
  });

  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.footingGeometry')}</h3>
        <Input 
            label={t('inputs.labels.length')} type="number"
            value={inputs.length || ''} onChange={e => handleInputChange('length', parseFloat(e.target.value))}
            unit={inputs.lengthUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('lengthUnit', u)}
            error={errors.length}
        />
        <Input 
            label={t('inputs.labels.width')} type="number"
            value={inputs.width || ''} onChange={e => handleInputChange('width', parseFloat(e.target.value))}
            unit={inputs.widthUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('widthUnit', u)}
            error={errors.width}
        />
        <Input 
            label={t('inputs.labels.thickness')} type="number"
            value={inputs.depth || ''} onChange={e => handleInputChange('depth', parseFloat(e.target.value))}
            unit={inputs.depthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('depthUnit', u)}
            error={errors.depth}
        />
        <Input 
            label={t('inputs.labels.span')} type="number"
            value={inputs.span || ''} onChange={e => handleInputChange('span', parseFloat(e.target.value))}
            unit={inputs.spanUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('spanUnit', u)}
            error={errors.span}
            tooltip={t('tooltips.aciRef')}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg min-h-[200px]">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <CombinedFootingSVG />
      </div>
    </div>
  );

  const ReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.bottomReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.barSizeBothWays')}
                    value={inputs.footingBottomBarSize} onChange={e => handleInputChange('footingBottomBarSize', e.target.value)}
                >
                    <option value="16mm">16 mm</option><option value="20mm">20 mm</option><option value="#5">#5</option><option value="#6">#6</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacing')} type="number"
                    value={inputs.footingBottomBarSpacing || ''} onChange={e => handleInputChange('footingBottomBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.footingBottomBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('footingBottomBarSpacingUnit', u)}
                    error={errors.footingBottomBarSpacing}
                />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.topReinfOptional')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <Select 
                    label={t('inputs.labels.barSizeBothWays')}
                    value={inputs.footingTopBarSize} onChange={e => handleInputChange('footingTopBarSize', e.target.value)}
                >
                    <option>None</option><option value="12mm">12 mm</option><option value="16mm">16 mm</option><option value="#4">#4</option><option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacing')} type="number"
                    value={inputs.footingTopBarSpacing || ''} onChange={e => handleInputChange('footingTopBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.footingTopBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('footingTopBarSpacingUnit', u)}
                    disabled={!inputs.footingTopBarSize || inputs.footingTopBarSize === 'None'}
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
        <ResultsPanel results={results} onClear={handleClear} onAddToProject={handleAddToProject} />
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

export default CombinedFootingCalculatorModal;