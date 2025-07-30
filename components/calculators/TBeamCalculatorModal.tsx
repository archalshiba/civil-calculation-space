

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ResultsPanel from '../ui/ResultsPanel';
import { TBeamSVG } from '../icons/SVGSchematics';
import { calculateTBeam } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface TBeamCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    width: 300,
    widthUnit: 'mm',
    depth: 600,
    depthUnit: 'mm',
    flangeWidth: 1200,
    flangeWidthUnit: 'mm',
    flangeThickness: 150,
    flangeThicknessUnit: 'mm',
    span: 8,
    spanUnit: 'm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    topBarSize: '16mm',
    topBarCount: 4,
    bottomBarSize: '25mm',
    bottomBarCount: 4,
    transverseBarSize: '10mm',
    transverseSpacing: 200,
    transverseSpacingUnit: 'mm',
};

const imperialDefaults: CalculationInputs = {
    width: 12,
    widthUnit: 'in',
    depth: 24,
    depthUnit: 'in',
    flangeWidth: 48,
    flangeWidthUnit: 'in',
    flangeThickness: 6,
    flangeThicknessUnit: 'in',
    span: 25,
    spanUnit: 'ft',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    topBarSize: '#5',
    topBarCount: 4,
    bottomBarSize: '#5',
    bottomBarCount: 4,
    transverseBarSize: '#3',
    transverseSpacing: 8,
    transverseSpacingUnit: 'in',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const TBeamCalculatorModal: React.FC<TBeamCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();

  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.width || currentInputs.width <= 0) newErrors.width = t('errors.positiveNumber');
      if (!currentInputs.depth || currentInputs.depth <= 0) newErrors.depth = t('errors.positiveNumber');
      if (!currentInputs.flangeWidth || currentInputs.flangeWidth <= 0) newErrors.flangeWidth = t('errors.positiveNumber');
      if (!currentInputs.flangeThickness || currentInputs.flangeThickness <= 0) newErrors.flangeThickness = t('errors.positiveNumber');
      if (currentInputs.flangeWidth < currentInputs.width) newErrors.flangeWidth = t('errors.flangeWiderThanWeb');
      if (currentInputs.flangeThickness > currentInputs.depth) newErrors.flangeThickness = t('errors.flangeThickerThanDepth');
      if (!currentInputs.span || currentInputs.span <= 0) newErrors.span = t('errors.positiveNumber');
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
      calculationFn: calculateTBeam,
      validationFn: validateInputs,
  });

  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.beamGeometry')}</h3>
        <Input 
            label={t('inputs.labels.flangeWidth')} type="number" 
            value={inputs.flangeWidth || ''} onChange={e => handleInputChange('flangeWidth', parseFloat(e.target.value))}
            unit={inputs.flangeWidthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('flangeWidthUnit', u)}
            error={errors.flangeWidth}
        />
        <Input 
            label={t('inputs.labels.flangeThickness')} type="number"
            value={inputs.flangeThickness || ''} onChange={e => handleInputChange('flangeThickness', parseFloat(e.target.value))}
            unit={inputs.flangeThicknessUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('flangeThicknessUnit', u)}
            error={errors.flangeThickness}
        />
        <Input 
            label={t('inputs.labels.webWidth')} type="number" 
            value={inputs.width || ''} onChange={e => handleInputChange('width', parseFloat(e.target.value))}
            unit={inputs.widthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('widthUnit', u)}
            error={errors.width}
        />
        <Input 
            label={t('inputs.labels.depth')} type="number"
            value={inputs.depth || ''} onChange={e => handleInputChange('depth', parseFloat(e.target.value))}
            unit={inputs.depthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('depthUnit', u)}
            error={errors.depth}
        />
        <Input 
            label={t('inputs.labels.span')} type="number"
            value={inputs.span || ''} onChange={e => handleInputChange('span', parseFloat(e.target.value))}
            unit={inputs.spanUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('spanUnit', u)}
            error={errors.span}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <TBeamSVG />
      </div>
    </div>
  );

  const ReinforcementTab = () => (
     <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.topReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.topBarSize} onChange={e => handleInputChange('topBarSize', e.target.value)}
                >
                    <option value="16mm">16 mm</option><option value="20mm">20 mm</option><option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.barCount')} type="number" min="2" 
                    value={inputs.topBarCount || ''} onChange={e => handleInputChange('topBarCount', parseInt(e.target.value))}
                />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.bottomReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.bottomBarSize} onChange={e => handleInputChange('bottomBarSize', e.target.value)}
                >
                    <option value="20mm">20 mm</option><option value="25mm">25 mm</option><option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.barCount')} type="number" min="2"
                    value={inputs.bottomBarCount || ''} onChange={e => handleInputChange('bottomBarCount', parseInt(e.target.value))}
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

export default TBeamCalculatorModal;