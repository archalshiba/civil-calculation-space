

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ResultsPanel from '../ui/ResultsPanel';
import { DiaphragmSVG } from '../icons/SVGSchematics';
import { calculateDiaphragm } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface DiaphragmCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    diaphragmThickness: 150,
    diaphragmThicknessUnit: 'mm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    collectorBarSize: '20mm',
    collectorBarCount: 4,
    chordBarSize: '20mm',
    chordBarCount: 4,
    shrinkageBarSize: '12mm',
    shrinkageBarSpacing: 250,
    shrinkageBarSpacingUnit: 'mm',
    modelingMethod: 'rigid',
};

const imperialDefaults: CalculationInputs = {
    diaphragmThickness: 6,
    diaphragmThicknessUnit: 'in',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    collectorBarSize: '#5',
    collectorBarCount: 4,
    chordBarSize: '#5',
    chordBarCount: 4,
    shrinkageBarSize: '#4',
    shrinkageBarSpacing: 10,
    shrinkageBarSpacingUnit: 'in',
    modelingMethod: 'rigid',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const DiaphragmCalculatorModal: React.FC<DiaphragmCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  
  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.diaphragmThickness || currentInputs.diaphragmThickness <= 0) newErrors.diaphragmThickness = t('errors.positiveNumber');
      if (!currentInputs.collectorBarCount || currentInputs.collectorBarCount < 1) newErrors.collectorBarCount = t('errors.minBars', {count: 1});
      if (!currentInputs.chordBarCount || currentInputs.chordBarCount < 1) newErrors.chordBarCount = t('errors.minBars', {count: 1});
      if (!currentInputs.shrinkageBarSpacing || currentInputs.shrinkageBarSpacing <= 0) newErrors.shrinkageBarSpacing = t('errors.positiveNumber');
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
      calculationFn: calculateDiaphragm,
      validationFn: validateInputs,
  });


  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.geometryAndMaterials')}</h3>
        <Input 
            label={t('inputs.labels.thickness')} type="number"
            value={inputs.diaphragmThickness || ''} onChange={e => handleInputChange('diaphragmThickness', parseFloat(e.target.value))}
            unit={inputs.diaphragmThicknessUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('diaphragmThicknessUnit', u)}
            error={errors.diaphragmThickness}
        />
        <Input 
            label={t('inputs.labels.concreteUnitWeight')} type="number"
            value={inputs.concreteUnitWeight || ''} onChange={e => handleInputChange('concreteUnitWeight', parseFloat(e.target.value))}
            unit={inputs.concreteUnitWeightUnit} units={['kg/m³', 'lb/ft³']} onUnitChange={u => handleUnitChange('concreteUnitWeightUnit', u)}
        />
        <Input label={t('inputs.labels.concreteStrength')} type="number" placeholder={t('placeholders.example', {value: 25})} unit="MPa" units={['MPa', 'psi']} />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg min-h-[200px]">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <DiaphragmSVG />
      </div>
    </div>
  );

  const ReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.boundaryAndCollectors')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.collectorBarSize')}
                    value={inputs.collectorBarSize} onChange={e => handleInputChange('collectorBarSize', e.target.value)}
                >
                    <option>16mm</option><option>20mm</option><option>25mm</option><option>#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.collectorBarCount')} type="number"
                    value={inputs.collectorBarCount || ''} onChange={e => handleInputChange('collectorBarCount', parseInt(e.target.value))}
                    error={errors.collectorBarCount}
                />
                <Select 
                    label={t('inputs.labels.chordBarSize')}
                    value={inputs.chordBarSize} onChange={e => handleInputChange('chordBarSize', e.target.value)}
                >
                    <option>16mm</option><option>20mm</option><option>25mm</option><option>#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.chordBarCount')} type="number"
                    value={inputs.chordBarCount || ''} onChange={e => handleInputChange('chordBarCount', parseInt(e.target.value))}
                    error={errors.chordBarCount}
                />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.tempReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.shrinkageBarSize} onChange={e => handleInputChange('shrinkageBarSize', e.target.value)}
                >
                    <option>10mm</option><option>12mm</option><option>#3</option><option>#4</option>
                </Select>
                <Input 
                    label={t('inputs.labels.spacingEachWay')} type="number"
                    value={inputs.shrinkageBarSpacing || ''} onChange={e => handleInputChange('shrinkageBarSpacing', parseFloat(e.target.value))}
                    unit={inputs.shrinkageBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('shrinkageBarSpacingUnit', u)}
                    error={errors.shrinkageBarSpacing}
                />
            </div>
        </div>
    </div>
  );
  
  const LoadsTab = () => (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.loadsAnalysis')}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Select 
                label={t('inputs.labels.modelingMethod')}
                value={inputs.modelingMethod}
                onChange={(e) => handleInputChange('modelingMethod', e.target.value)}
            >
                <option value="flexible">{t('inputs.options.flexible')}</option>
                <option value="rigid">{t('inputs.options.rigid')}</option>
                <option value="semi-rigid">{t('inputs.options.semiRigid')}</option>
            </Select>
            <Input label={t('inputs.labels.lateralLoad')} type="number" placeholder={t('placeholders.example', {value: 5.0})} unit="kPa" units={['kPa', 'psf']} />
        </div>
      </div>
  );

  const tabs = [
    { label: t('tabs.geometryAndMaterials'), content: <GeometryTab /> },
    { label: t('tabs.reinforcement'), content: <ReinforcementTab /> },
    { label: t('tabs.loadsAnalysis'), content: <LoadsTab /> },
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

export default DiaphragmCalculatorModal;