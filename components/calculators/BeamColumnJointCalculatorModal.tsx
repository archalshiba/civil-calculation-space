

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import ResultsPanel from '../ui/ResultsPanel';
import { BeamColumnJointSVG } from '../icons/SVGSchematics';
import { calculateBeamColumnJoint } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface BeamColumnJointCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    columnDepth: 450,
    columnDepthUnit: 'mm',
    beamDepth: 500,
    beamDepthUnit: 'mm',
    factoredShearVu: 300,
    factoredShearVuUnit: 'kN',
    jointEffectiveWidth: 400,
    jointEffectiveWidthUnit: 'mm',
    concreteStrength: 25,
    concreteStrengthUnit: 'MPa',
};

const imperialDefaults: CalculationInputs = {
    columnDepth: 18,
    columnDepthUnit: 'in',
    beamDepth: 20,
    beamDepthUnit: 'in',
    factoredShearVu: 67,
    factoredShearVuUnit: 'kip',
    jointEffectiveWidth: 16,
    jointEffectiveWidthUnit: 'in',
    concreteStrength: 4000,
    concreteStrengthUnit: 'psi',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const BeamColumnJointCalculatorModal: React.FC<BeamColumnJointCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  
  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.columnDepth || currentInputs.columnDepth <= 0) newErrors.columnDepth = t('errors.positiveNumber');
      if (!currentInputs.beamDepth || currentInputs.beamDepth <= 0) newErrors.beamDepth = t('errors.positiveNumber');
      if (!currentInputs.factoredShearVu || currentInputs.factoredShearVu <= 0) newErrors.factoredShearVu = t('errors.positiveNumber');
      if (!currentInputs.jointEffectiveWidth || currentInputs.jointEffectiveWidth <= 0) newErrors.jointEffectiveWidth = t('errors.positiveNumber');
      if (!currentInputs.concreteStrength || currentInputs.concreteStrength <= 0) newErrors.concreteStrength = t('errors.positiveNumber');
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
      calculationFn: calculateBeamColumnJoint,
      validationFn: validateInputs,
  });

  const JointDetailsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.jointDetails')}</h3>
        <Input 
            label={t('inputs.labels.columnDepth')} type="number"
            value={inputs.columnDepth || ''} onChange={e => handleInputChange('columnDepth', parseFloat(e.target.value))}
            unit={inputs.columnDepthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('columnDepthUnit', u)}
            error={errors.columnDepth}
        />
        <Input 
            label={t('inputs.labels.beamDepth')} type="number"
            value={inputs.beamDepth || ''} onChange={e => handleInputChange('beamDepth', parseFloat(e.target.value))}
            unit={inputs.beamDepthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('beamDepthUnit', u)}
            error={errors.beamDepth}
        />
        <Input 
            label={t('inputs.labels.factoredShearOnJoint')} type="number"
            value={inputs.factoredShearVu || ''} onChange={e => handleInputChange('factoredShearVu', parseFloat(e.target.value))}
            unit={inputs.factoredShearVuUnit} units={['kN', 'kip']} onUnitChange={u => handleUnitChange('factoredShearVuUnit', u)}
            error={errors.factoredShearVu}
        />
        <Input 
            label={t('inputs.labels.effectiveJointWidth')} type="number"
            value={inputs.jointEffectiveWidth || ''} onChange={e => handleInputChange('jointEffectiveWidth', parseFloat(e.target.value))}
            unit={inputs.jointEffectiveWidthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('jointEffectiveWidthUnit', u)}
            error={errors.jointEffectiveWidth}
        />
         <Input 
            label={t('inputs.labels.concreteStrength')} type="number"
            value={inputs.concreteStrength || ''} onChange={e => handleInputChange('concreteStrength', parseFloat(e.target.value))}
            unit={inputs.concreteStrengthUnit} units={['MPa', 'psi']} onUnitChange={u => handleUnitChange('concreteStrengthUnit', u)}
            error={errors.concreteStrength}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg min-h-[200px]">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <BeamColumnJointSVG />
      </div>
    </div>
  );

  const ReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.jointConfinementReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <Select 
                    label={t('inputs.labels.tieBarSize')}
                >
                    <option>10 mm</option>
                    <option>12 mm</option>
                    <option>#3</option>
                    <option>#4</option>
                 </Select>
                 <Input label={t('inputs.labels.spacing')} type="number" placeholder={t('placeholders.example', {value: 100})} unit="mm" units={['mm', 'in']} />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.options')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select label={t('inputs.labels.jointConfinementCondition')}>
                    <option>{t('inputs.options.type1')}</option>
                    <option>{t('inputs.options.type2')}</option>
                </Select>
                 <Checkbox label={t('inputs.labels.accountForAxialLoad')} checked={false} onChange={() => {}}/>
            </div>
        </div>
    </div>
);

  const tabs = [
    { label: t('tabs.jointDetails'), content: <JointDetailsTab /> },
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

export default BeamColumnJointCalculatorModal;