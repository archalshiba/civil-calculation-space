

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ResultsPanel from '../ui/ResultsPanel';
import { TwoWaySlabSVG } from '../icons/SVGSchematics';
import { calculateTwoWaySlab } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface TwoWaySlabCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    depth: 250,
    depthUnit: 'mm',
    length: 8,
    lengthUnit: 'm',
    span: 6,
    spanUnit: 'm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    shortDirBarSize: '16mm',
    shortDirBarSpacing: 150,
    shortDirBarSpacingUnit: 'mm',
    longDirBarSize: '12mm',
    longDirBarSpacing: 200,
    longDirBarSpacingUnit: 'mm',
};

const imperialDefaults: CalculationInputs = {
    depth: 10,
    depthUnit: 'in',
    length: 25,
    lengthUnit: 'ft',
    span: 20,
    spanUnit: 'ft',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    shortDirBarSize: '#5',
    shortDirBarSpacing: 6,
    shortDirBarSpacingUnit: 'in',
    longDirBarSize: '#4',
    longDirBarSpacing: 8,
    longDirBarSpacingUnit: 'in',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const TwoWaySlabCalculatorModal: React.FC<TwoWaySlabCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  
  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.depth || currentInputs.depth <= 0) newErrors.depth = t('errors.positiveNumber');
      if (!currentInputs.length || currentInputs.length <= 0) newErrors.length = t('errors.positiveNumber');
      if (!currentInputs.span || currentInputs.span <= 0) newErrors.span = t('errors.positiveNumber');
      if (!currentInputs.shortDirBarSpacing || currentInputs.shortDirBarSpacing <= 0) newErrors.shortDirBarSpacing = t('errors.positiveNumber');
      if (!currentInputs.longDirBarSpacing || currentInputs.longDirBarSpacing <= 0) newErrors.longDirBarSpacing = t('errors.positiveNumber');

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
      calculationFn: calculateTwoWaySlab,
      validationFn: validateInputs,
  });


  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.slabGeometry')}</h3>
        <Input 
            label={t('inputs.labels.thickness')} type="number"
            value={inputs.depth || ''} onChange={e => handleInputChange('depth', parseFloat(e.target.value))}
            unit={inputs.depthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('depthUnit', u)}
            error={errors.depth}
        />
        <Input 
            label={t('inputs.labels.longDimension')} type="number"
            value={inputs.length || ''} onChange={e => handleInputChange('length', parseFloat(e.target.value))}
            unit={inputs.lengthUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('lengthUnit', u)}
            error={errors.length}
        />
        <Input 
            label={t('inputs.labels.shortDimension')} type="number"
            value={inputs.span || ''} onChange={e => handleInputChange('span', parseFloat(e.target.value))}
            unit={inputs.spanUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('spanUnit', u)}
            error={errors.span}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <TwoWaySlabSVG />
      </div>
    </div>
  );

  const MaterialTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.materials')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input 
            label={t('inputs.labels.concreteUnitWeight')} type="number"
            value={inputs.concreteUnitWeight || ''} onChange={e => handleInputChange('concreteUnitWeight', parseFloat(e.target.value))}
            unit={inputs.concreteUnitWeightUnit} units={['kg/m³', 'lb/ft³']} onUnitChange={u => handleUnitChange('concreteUnitWeightUnit', u)}
        />
        <Input label={t('inputs.labels.concreteStrength')} type="number" placeholder={t('placeholders.example', {value: 25})} unit="MPa" units={['MPa', 'psi']} />
      </div>
    </div>
  );

  const ReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.reinfDetails')} ({t('inputs.sections.shortDimension')})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.shortDirBarSize} onChange={e => handleInputChange('shortDirBarSize', e.target.value)}
                >
                    <option value="12mm">12 mm</option><option value="16mm">16 mm</option><option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacing')} type="number"
                    value={inputs.shortDirBarSpacing || ''} onChange={e => handleInputChange('shortDirBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.shortDirBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('shortDirBarSpacingUnit', u)}
                    error={errors.shortDirBarSpacing}
                />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.reinfDetails')} ({t('inputs.sections.longDimension')})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.longDirBarSize} onChange={e => handleInputChange('longDirBarSize', e.target.value)}
                >
                    <option value="10mm">10 mm</option><option value="12mm">12 mm</option><option value="#4">#4</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacing')} type="number"
                    value={inputs.longDirBarSpacing || ''} onChange={e => handleInputChange('longDirBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.longDirBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('longDirBarSpacingUnit', u)}
                    error={errors.longDirBarSpacing}
                />
            </div>
        </div>
    </div>
  );

  const tabs = [
    { label: t('tabs.geometry'), content: <GeometryTab /> },
    { label: t('tabs.materials'), content: <MaterialTab /> },
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

export default TwoWaySlabCalculatorModal;