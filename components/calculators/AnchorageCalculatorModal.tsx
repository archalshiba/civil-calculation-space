

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ResultsPanel from '../ui/ResultsPanel';
import { AnchorageSVG } from '../icons/SVGSchematics';
import { calculateAnchorage } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface AnchorageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    anchorType: 'cast-in',
    anchorSize: 'M16',
    concreteStrength: 25,
    concreteStrengthUnit: 'MPa',
    embedmentDepth: 125,
    embedmentDepthUnit: 'mm',
    edgeDistance: 150,
    edgeDistanceUnit: 'mm',
    anchorSpacing: 300,
    anchorSpacingUnit: 'mm',
    factoredTension: 25,
    factoredTensionUnit: 'kN',
    factoredShear: 15,
    factoredShearUnit: 'kN',
};

const imperialDefaults: CalculationInputs = {
    anchorType: 'cast-in',
    anchorSize: '5/8"',
    concreteStrength: 4000,
    concreteStrengthUnit: 'psi',
    embedmentDepth: 5,
    embedmentDepthUnit: 'in',
    edgeDistance: 6,
    edgeDistanceUnit: 'in',
    anchorSpacing: 12,
    anchorSpacingUnit: 'in',
    factoredTension: 5.5,
    factoredTensionUnit: 'kip',
    factoredShear: 3.5,
    factoredShearUnit: 'kip',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const AnchorageCalculatorModal: React.FC<AnchorageCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  
  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.concreteStrength || currentInputs.concreteStrength <= 0) newErrors.concreteStrength = t('errors.positiveNumber');
      if (!currentInputs.embedmentDepth || currentInputs.embedmentDepth <= 0) newErrors.embedmentDepth = t('errors.positiveNumber');
      if (!currentInputs.edgeDistance || currentInputs.edgeDistance <= 0) newErrors.edgeDistance = t('errors.positiveNumber');
      if (!currentInputs.anchorSpacing || currentInputs.anchorSpacing <= 0) newErrors.anchorSpacing = t('errors.positiveNumber');
      if (currentInputs.factoredTension === undefined || currentInputs.factoredTension < 0) newErrors.factoredTension = t('errors.nonNegative');
      if (currentInputs.factoredShear === undefined || currentInputs.factoredShear < 0) newErrors.factoredShear = t('errors.nonNegative');
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
      calculationFn: calculateAnchorage,
      validationFn: validateInputs,
  });

  const GeometryLoadsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.anchorDetails')}</h3>
        <Select label={t('inputs.labels.anchorType')} value={inputs.anchorType} onChange={e => handleInputChange('anchorType', e.target.value)}>
          <option value="cast-in">{t('inputs.options.castIn', {defaultValue: 'Cast-In'})}</option>
          <option value="adhesive" disabled>{t('inputs.options.adhesive', {defaultValue: 'Adhesive'})} ({t('common.comingSoon')})</option>
          <option value="mechanical" disabled>{t('inputs.options.mechanical', {defaultValue: 'Mechanical'})} ({t('common.comingSoon')})</option>
        </Select>
        <Select label={t('inputs.labels.anchorSize')} value={inputs.anchorSize} onChange={e => handleInputChange('anchorSize', e.target.value)}>
          <option value="M12">M12</option>
          <option value="M16">M16</option>
          <option value="M20">M20</option>
          <option value={'1/2"'}>1/2"</option>
          <option value={'5/8"'}>5/8"</option>
        </Select>
        <Input label={t('inputs.labels.embedmentDepth')} type="number" value={inputs.embedmentDepth || ''} onChange={e => handleInputChange('embedmentDepth', parseFloat(e.target.value))} unit={inputs.embedmentDepthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('embedmentDepthUnit', u)} error={errors.embedmentDepth}/>
        <Input label={t('inputs.labels.edgeDistance')} type="number" value={inputs.edgeDistance || ''} onChange={e => handleInputChange('edgeDistance', parseFloat(e.target.value))} unit={inputs.edgeDistanceUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('edgeDistanceUnit', u)} error={errors.edgeDistance}/>
        <Input label={t('inputs.labels.anchorSpacing')} type="number" value={inputs.anchorSpacing || ''} onChange={e => handleInputChange('anchorSpacing', parseFloat(e.target.value))} unit={inputs.anchorSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('anchorSpacingUnit', u)} error={errors.anchorSpacing}/>
      </div>
       <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg min-h-[200px]">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <AnchorageSVG />
      </div>
    </div>
  );
  
  const MaterialsLoadsTab = () => (
      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.materials')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input label={t('inputs.labels.concreteStrength')} type="number" value={inputs.concreteStrength || ''} onChange={e => handleInputChange('concreteStrength', parseFloat(e.target.value))} unit={inputs.concreteStrengthUnit} units={['MPa', 'psi']} onUnitChange={u => handleUnitChange('concreteStrengthUnit', u)} error={errors.concreteStrength}/>
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.loads')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input label={t('inputs.labels.factoredTension')} type="number" value={inputs.factoredTension || ''} onChange={e => handleInputChange('factoredTension', parseFloat(e.target.value))} unit={inputs.factoredTensionUnit} units={['kN', 'kip']} onUnitChange={u => handleUnitChange('factoredTensionUnit', u)} error={errors.factoredTension}/>
                <Input label={t('inputs.labels.factoredShear')} type="number" value={inputs.factoredShear || ''} onChange={e => handleInputChange('factoredShear', parseFloat(e.target.value))} unit={inputs.factoredShearUnit} units={['kN', 'kip']} onUnitChange={u => handleUnitChange('factoredShearUnit', u)} error={errors.factoredShear}/>
            </div>
        </div>
    </div>
  );

  const tabs = [
    { label: t('tabs.geometry'), content: <GeometryLoadsTab /> },
    { label: t('tabs.materialsAndLoads'), content: <MaterialsLoadsTab /> },
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

export default AnchorageCalculatorModal;
