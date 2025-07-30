
import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ResultsPanel from '../ui/ResultsPanel';
import { PileCapSVG } from '../icons/SVGSchematics';
import { calculatePileCapFoundation } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import { toSI } from '../../utils/units';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface PileCapFoundationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    length: 2000,
    lengthUnit: 'mm',
    width: 2000,
    widthUnit: 'mm',
    depth: 800,
    depthUnit: 'mm',
    pileCount: 4,
    pileDiameter: 500,
    pileDiameterUnit: 'mm',
    pileSpacing: 1500,
    pileSpacingUnit: 'mm',
    capEdgeDistance: 250,
    capEdgeDistanceUnit: 'mm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    footingBottomBarSize: '20mm',
    footingBottomBarSpacing: 150,
    footingBottomBarSpacingUnit: 'mm',
    footingTopBarSize: '16mm',
    footingTopBarSpacing: 200,
    footingTopBarSpacingUnit: 'mm',
    dowelBarSize: '20mm',
    dowelBarCount: 8,
};

const imperialDefaults: CalculationInputs = {
    length: 7,
    lengthUnit: 'ft',
    width: 7,
    widthUnit: 'ft',
    depth: 30,
    depthUnit: 'in',
    pileCount: 4,
    pileDiameter: 18,
    pileDiameterUnit: 'in',
    pileSpacing: 54,
    pileSpacingUnit: 'in',
    capEdgeDistance: 15,
    capEdgeDistanceUnit: 'in',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    footingBottomBarSize: '#6',
    footingBottomBarSpacing: 6,
    footingBottomBarSpacingUnit: 'in',
    footingTopBarSize: '#5',
    footingTopBarSpacing: 8,
    footingTopBarSpacingUnit: 'in',
    dowelBarSize: '#6',
    dowelBarCount: 8,
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const PileCapFoundationModal: React.FC<PileCapFoundationModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  
  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.length || currentInputs.length <= 0) newErrors.length = t('errors.positiveNumber');
      if (!currentInputs.width || currentInputs.width <= 0) newErrors.width = t('errors.positiveNumber');
      if (!currentInputs.depth || currentInputs.depth <= 0) newErrors.depth = t('errors.positiveNumber');
      if (!currentInputs.pileCount || currentInputs.pileCount <= 0) newErrors.pileCount = t('errors.positiveNumber');
      if (!currentInputs.pileSpacing || currentInputs.pileSpacing <= 0) newErrors.pileSpacing = t('errors.positiveNumber');
      if (!currentInputs.capEdgeDistance || currentInputs.capEdgeDistance <= 0) newErrors.capEdgeDistance = t('errors.positiveNumber');

      if (currentInputs.pileCount > 1 && currentInputs.pileSpacing && currentInputs.capEdgeDistance && currentInputs.width) {
        const spacing_m = toSI(currentInputs.pileSpacing, currentInputs.pileSpacingUnit);
        const edge_m = toSI(currentInputs.capEdgeDistance, currentInputs.capEdgeDistanceUnit);
        const width_m = toSI(currentInputs.width, currentInputs.widthUnit);
        if (spacing_m + 2 * edge_m > width_m) {
            newErrors.pileSpacing = t('errors.pileConfig');
        }
      }

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
      calculationFn: calculatePileCapFoundation,
      validationFn: validateInputs,
  });

  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.pileCapGeometry')}</h3>
        <Input label={t('inputs.labels.length')} type="number" value={inputs.length || ''} onChange={e => handleInputChange('length', parseFloat(e.target.value))} unit={inputs.lengthUnit} units={['mm', 'm', 'in', 'ft']} onUnitChange={u => handleUnitChange('lengthUnit', u)} error={errors.length} />
        <Input label={t('inputs.labels.width')} type="number" value={inputs.width || ''} onChange={e => handleInputChange('width', parseFloat(e.target.value))} unit={inputs.widthUnit} units={['mm', 'm', 'in', 'ft']} onUnitChange={u => handleUnitChange('widthUnit', u)} error={errors.width} />
        <Input label={t('inputs.labels.thickness')} type="number" value={inputs.depth || ''} onChange={e => handleInputChange('depth', parseFloat(e.target.value))} unit={inputs.depthUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('depthUnit', u)} error={errors.depth} />
        <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.pileConfiguration')}</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <Input label={t('inputs.labels.pileCount')} type="number" value={inputs.pileCount || ''} onChange={e => handleInputChange('pileCount', parseInt(e.target.value))} error={errors.pileCount} />
                <Input label={t('inputs.labels.pileDiameter')} type="number" value={inputs.pileDiameter || ''} onChange={e => handleInputChange('pileDiameter', parseFloat(e.target.value))} unit={inputs.pileDiameterUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('pileDiameterUnit', u)} />
                <Input label={t('inputs.labels.pileSpacing')} type="number" value={inputs.pileSpacing || ''} onChange={e => handleInputChange('pileSpacing', parseFloat(e.target.value))} unit={inputs.pileSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('pileSpacingUnit', u)} error={errors.pileSpacing}/>
                <Input label={t('inputs.labels.capEdgeDistance')} type="number" value={inputs.capEdgeDistance || ''} onChange={e => handleInputChange('capEdgeDistance', parseFloat(e.target.value))} unit={inputs.capEdgeDistanceUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('capEdgeDistanceUnit', u)} error={errors.capEdgeDistance} tooltip={t('tooltips.capEdgeDistance')} />
            </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg min-h-[200px]">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <PileCapSVG />
      </div>
    </div>
  );

  const ReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.bottomReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select label={t('inputs.labels.barSizeBothWays')} value={inputs.footingBottomBarSize} onChange={e => handleInputChange('footingBottomBarSize', e.target.value)}>
                    <option value="16mm">16 mm</option><option value="20mm">20 mm</option><option value="25mm">25 mm</option><option value="#5">#5</option><option value="#6">#6</option>
                </Select>
                <Input label={t('inputs.labels.spacing')} type="number" value={inputs.footingBottomBarSpacing || ''} onChange={e => handleInputChange('footingBottomBarSpacing', parseFloat(e.target.value))} unit={inputs.footingBottomBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('footingBottomBarSpacingUnit', u)} />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.topReinfOptional')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <Select label={t('inputs.labels.barSizeBothWays')} value={inputs.footingTopBarSize} onChange={e => handleInputChange('footingTopBarSize', e.target.value)}>
                    <option>None</option><option value="12mm">12 mm</option><option value="16mm">16 mm</option><option value="#4">#4</option><option value="#5">#5</option>
                </Select>
                <Input label={t('inputs.labels.spacing')} type="number" value={inputs.footingTopBarSpacing || ''} onChange={e => handleInputChange('footingTopBarSpacing', parseFloat(e.target.value))} unit={inputs.footingTopBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('footingTopBarSpacingUnit', u)} disabled={!inputs.footingTopBarSize || inputs.footingTopBarSize === 'None'} />
            </div>
        </div>
         <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.columnDowels')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Select label={t('inputs.labels.dowelBarSize')} value={inputs.dowelBarSize} onChange={e => handleInputChange('dowelBarSize', e.target.value)}>
                    <option value="16mm">16 mm</option><option value="20mm">20 mm</option><option value="25mm">25 mm</option><option value="#5">#5</option>
                </Select>
                <Input label={t('inputs.labels.dowelBarCount')} type="number" value={inputs.dowelBarCount || ''} onChange={e => handleInputChange('dowelBarCount', parseInt(e.target.value))} />
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

export default PileCapFoundationModal;
