

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import RadioGroup from '../ui/RadioGroup';
import ResultsPanel from '../ui/ResultsPanel';
import { RectangularWallSVG } from '../icons/SVGSchematics';
import { calculateRectangularWall } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface WallCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    depth: 200, // Using depth for thickness
    depthUnit: 'mm',
    length: 6,
    lengthUnit: 'm',
    height: 3,
    heightUnit: 'm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    verticalBarSize: '12mm',
    verticalBarSpacing: 200,
    verticalBarSpacingUnit: 'mm',
    horizontalBarSize: '12mm',
    horizontalBarSpacing: 200,
    horizontalBarSpacingUnit: 'mm',
    reinforcementLayers: 'double',
};

const imperialDefaults: CalculationInputs = {
    depth: 8,
    depthUnit: 'in',
    length: 20,
    lengthUnit: 'ft',
    height: 10,
    heightUnit: 'ft',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    verticalBarSize: '#4',
    verticalBarSpacing: 8,
    verticalBarSpacingUnit: 'in',
    horizontalBarSize: '#4',
    horizontalBarSpacing: 8,
    horizontalBarSpacingUnit: 'in',
    reinforcementLayers: 'double',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
}

const WallCalculatorModal: React.FC<WallCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();

  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.depth || currentInputs.depth <= 0) newErrors.depth = t('errors.positiveNumber');
      if (!currentInputs.length || currentInputs.length <= 0) newErrors.length = t('errors.positiveNumber');
      if (!currentInputs.height || currentInputs.height <= 0) newErrors.height = t('errors.positiveNumber');
      if (!currentInputs.verticalBarSpacing || currentInputs.verticalBarSpacing <= 0) newErrors.verticalBarSpacing = t('errors.positiveNumber');
      if (!currentInputs.horizontalBarSpacing || currentInputs.horizontalBarSpacing <= 0) newErrors.horizontalBarSpacing = t('errors.positiveNumber');

      return newErrors;
  };

  const {
      inputs, results, errors, isCalculating,
      handleInputChange, handleUnitChange, handleRadioChange,
      handleCalculate, handleClear, handleAddToProject, handleCloseAndClear,
  } = useCalculatorForm<CalculationInputs, CalculationResults>({
      calculatorTitle: title,
      isOpen,
      onClose,
      initialInputs: getDefaultInputs(),
      calculationFn: calculateRectangularWall,
      validationFn: validateInputs,
  });

  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.wallGeometry')}</h3>
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
        <Input 
            label={t('inputs.labels.unbracedHeight')} type="number"
            value={inputs.height || ''} onChange={e => handleInputChange('height', parseFloat(e.target.value))}
            unit={inputs.heightUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('heightUnit', u)}
            error={errors.height}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg min-h-[200px]">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <RectangularWallSVG />
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
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.verticalReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.verticalBarSize} onChange={e => handleInputChange('verticalBarSize', e.target.value)}
                >
                    <option value="12mm">12 mm</option>
                    <option value="16mm">16 mm</option>
                    <option value="20mm">20 mm</option>
                    <option value="#4">#4</option>
                    <option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacing')} type="number"
                    value={inputs.verticalBarSpacing || ''} onChange={e => handleInputChange('verticalBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.verticalBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('verticalBarSpacingUnit', u)}
                    error={errors.verticalBarSpacing}
                />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.horizontalReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.horizontalBarSize} onChange={e => handleInputChange('horizontalBarSize', e.target.value)}
                >
                    <option value="12mm">12 mm</option>
                    <option value="16mm">16 mm</option>
                    <option value="#4">#4</option>
                    <option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacing')} type="number"
                    value={inputs.horizontalBarSpacing || ''} onChange={e => handleInputChange('horizontalBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.horizontalBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('horizontalBarSpacingUnit', u)}
                    error={errors.horizontalBarSpacing}
                />
            </div>
        </div>
         <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.reinfDetails')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <RadioGroup
                    label={t('inputs.labels.reinfLayers')}
                    name="reinforcementLayers"
                    options={[{value: 'single', label: t('inputs.options.singleLayer')}, {value: 'double', label: t('inputs.options.doubleLayer')}]}
                    selectedValue={inputs.reinforcementLayers || 'double'}
                    onChange={(val) => handleRadioChange('reinforcementLayers', val)}
                />
                <Input label={t('inputs.labels.concreteCover')} type="number" placeholder={t('placeholders.example', {value: 30})} unit="mm" units={['mm', 'in']} />
            </div>
        </div>
    </div>
  );
  
  const FormworkTab = () => (
    <div className="space-y-6">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.formworkCalc')}</h3>
        <div className="bg-surface-secondary/50 p-4 rounded-lg">
            <span className="text-text-secondary">{t('results.autoFormworkAreaBothFaces')}: </span>
            <span className="text-xl font-bold text-text-primary">{results?.formworkArea ?? '...'}</span>
        </div>
    </div>
  );

  const tabs = [
    { label: t('tabs.geometry'), content: <GeometryTab /> },
    { label: t('tabs.materials'), content: <MaterialTab /> },
    { label: t('tabs.reinforcement'), content: <ReinforcementTab /> },
    { label: t('tabs.formwork'), content: <FormworkTab /> },
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

export default WallCalculatorModal;