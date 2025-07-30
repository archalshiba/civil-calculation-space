

import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ResultsPanel from '../ui/ResultsPanel';
import { RetainingWallSVG } from '../icons/SVGSchematics';
import { calculateRetainingWall } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import { toSI } from '../../utils/units';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface RetainingWallCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    stemHeight: 3.0,
    stemHeightUnit: 'm',
    stemThicknessTop: 200,
    stemThicknessTopUnit: 'mm',
    stemThicknessBottom: 300,
    stemThicknessBottomUnit: 'mm',
    footingThickness: 400,
    footingThicknessUnit: 'mm',
    toeLength: 1.0,
    toeLengthUnit: 'm',
    heelLength: 1.5,
    heelLengthUnit: 'm',
    soilUnitWeight: 18,
    soilUnitWeightUnit: 'kN/m³',
    soilFrictionAngle: 30,
    soilBearingPressure: 150,
    soilBearingPressureUnit: 'kPa',
    surchargeLoad: 10,
    surchargeLoadUnit: 'kPa',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    verticalBarSize: '16mm',
    verticalBarSpacing: 150,
    verticalBarSpacingUnit: 'mm',
    horizontalBarSize: '12mm',
    horizontalBarSpacing: 200,
    horizontalBarSpacingUnit: 'mm',
    footingBottomBarSize: '16mm',
    footingBottomBarSpacing: 150,
    footingBottomBarSpacingUnit: 'mm',
};

const imperialDefaults: CalculationInputs = {
    stemHeight: 10,
    stemHeightUnit: 'ft',
    stemThicknessTop: 8,
    stemThicknessTopUnit: 'in',
    stemThicknessBottom: 12,
    stemThicknessBottomUnit: 'in',
    footingThickness: 16,
    footingThicknessUnit: 'in',
    toeLength: 3,
    toeLengthUnit: 'ft',
    heelLength: 5,
    heelLengthUnit: 'ft',
    soilUnitWeight: 120,
    soilUnitWeightUnit: 'pcf',
    soilFrictionAngle: 30,
    soilBearingPressure: 3000,
    soilBearingPressureUnit: 'psf',
    surchargeLoad: 200,
    surchargeLoadUnit: 'psf',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    verticalBarSize: '#5',
    verticalBarSpacing: 6,
    verticalBarSpacingUnit: 'in',
    horizontalBarSize: '#4',
    horizontalBarSpacing: 8,
    horizontalBarSpacingUnit: 'in',
    footingBottomBarSize: '#5',
    footingBottomBarSpacing: 6,
    footingBottomBarSpacingUnit: 'in',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const RetainingWallCalculatorModal: React.FC<RetainingWallCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();

  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.stemHeight || currentInputs.stemHeight <= 0) newErrors.stemHeight = t('errors.positiveNumber');
      if (!currentInputs.stemThicknessBottom || currentInputs.stemThicknessBottom <= 0) newErrors.stemThicknessBottom = t('errors.positiveNumber');
      if (!currentInputs.footingThickness || currentInputs.footingThickness <= 0) newErrors.footingThickness = t('errors.positiveNumber');
      if (!currentInputs.heelLength || currentInputs.heelLength <= 0) newErrors.heelLength = t('errors.positiveNumber');
      if (currentInputs.toeLength === undefined || currentInputs.toeLength < 0) newErrors.toeLength = t('errors.nonNegative');
      if (!currentInputs.soilUnitWeight || currentInputs.soilUnitWeight <= 0) newErrors.soilUnitWeight = t('errors.positiveNumber');
      if (!currentInputs.soilFrictionAngle || currentInputs.soilFrictionAngle <= 0 || currentInputs.soilFrictionAngle >= 90) newErrors.soilFrictionAngle = t('errors.frictionAngleRange');
      
      if (currentInputs.stemThicknessTop && currentInputs.stemThicknessBottom) {
        const top_val = toSI(currentInputs.stemThicknessTop, currentInputs.stemThicknessTopUnit);
        const bottom_val = toSI(currentInputs.stemThicknessBottom, currentInputs.stemThicknessBottomUnit);
        if (top_val > bottom_val) {
            newErrors.stemThicknessTop = t('errors.stemTaper');
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
      calculationFn: calculateRetainingWall,
      validationFn: validateInputs,
  });

  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.wallGeometry')}</h3>
        <Input label={t('inputs.labels.stemHeight')} type="number" value={inputs.stemHeight || ''} onChange={e => handleInputChange('stemHeight', parseFloat(e.target.value))} unit={inputs.stemHeightUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('stemHeightUnit', u)} error={errors.stemHeight}/>
        <Input label={t('inputs.labels.stemThicknessTop')} type="number" value={inputs.stemThicknessTop || ''} onChange={e => handleInputChange('stemThicknessTop', parseFloat(e.target.value))} unit={inputs.stemThicknessTopUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('stemThicknessTopUnit', u)} error={errors.stemThicknessTop}/>
        <Input label={t('inputs.labels.stemThicknessBottom')} type="number" value={inputs.stemThicknessBottom || ''} onChange={e => handleInputChange('stemThicknessBottom', parseFloat(e.target.value))} unit={inputs.stemThicknessBottomUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('stemThicknessBottomUnit', u)} error={errors.stemThicknessBottom}/>
        <Input label={t('inputs.labels.footingThickness')} type="number" value={inputs.footingThickness || ''} onChange={e => handleInputChange('footingThickness', parseFloat(e.target.value))} unit={inputs.footingThicknessUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('footingThicknessUnit', u)} error={errors.footingThickness}/>
        <Input label={t('inputs.labels.toeLength')} type="number" value={inputs.toeLength || ''} onChange={e => handleInputChange('toeLength', parseFloat(e.target.value))} unit={inputs.toeLengthUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('toeLengthUnit', u)} error={errors.toeLength}/>
        <Input label={t('inputs.labels.heelLength')} type="number" value={inputs.heelLength || ''} onChange={e => handleInputChange('heelLength', parseFloat(e.target.value))} unit={inputs.heelLengthUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('heelLengthUnit', u)} error={errors.heelLength}/>
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg min-h-[200px]">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <RetainingWallSVG />
      </div>
    </div>
  );

  const SoilLoadsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.materialsSoil')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Input label={t('inputs.labels.soilUnitWeight')} type="number" value={inputs.soilUnitWeight || ''} onChange={e => handleInputChange('soilUnitWeight', parseFloat(e.target.value))} unit={inputs.soilUnitWeightUnit} units={['kN/m³', 'pcf']} onUnitChange={u => handleUnitChange('soilUnitWeightUnit', u)} error={errors.soilUnitWeight}/>
            <Input label={t('inputs.labels.soilFrictionAngle')} type="number" value={inputs.soilFrictionAngle || ''} onChange={e => handleInputChange('soilFrictionAngle', parseFloat(e.target.value))} unit="°" error={errors.soilFrictionAngle} tooltip={t('tooltips.soilFrictionAngle')} />
            <Input label={t('inputs.labels.soilBearingPressure')} type="number" value={inputs.soilBearingPressure || ''} onChange={e => handleInputChange('soilBearingPressure', parseFloat(e.target.value))} unit={inputs.soilBearingPressureUnit} units={['kPa', 'psf']} onUnitChange={u => handleUnitChange('soilBearingPressureUnit', u)} tooltip={t('tooltips.soilBearingPressure')} />
            <Input label={t('inputs.labels.concreteUnitWeight')} type="number" value={inputs.concreteUnitWeight || ''} onChange={e => handleInputChange('concreteUnitWeight', parseFloat(e.target.value))} unit={inputs.concreteUnitWeightUnit} units={['kg/m³', 'lb/ft³']} onUnitChange={u => handleUnitChange('concreteUnitWeightUnit', u)} />
        </div>
      </div>
       <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.loads')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Input label={t('inputs.labels.surchargeLoad')} type="number" value={inputs.surchargeLoad || ''} onChange={e => handleInputChange('surchargeLoad', parseFloat(e.target.value))} unit={inputs.surchargeLoadUnit} units={['kPa', 'psf']} onUnitChange={u => handleUnitChange('surchargeLoadUnit', u)} tooltip={t('tooltips.surchargeLoad')}/>
        </div>
      </div>
    </div>
  );

  const ReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.stemReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select label={t('inputs.labels.verticalBarSize')} value={inputs.verticalBarSize} onChange={e => handleInputChange('verticalBarSize', e.target.value)}><option value="12mm">12mm</option><option value="16mm">16mm</option><option value="20mm">20mm</option><option value="#4">#4</option><option value="#5">#5</option></Select>
                <Input label={t('inputs.labels.spacing')} type="number" value={inputs.verticalBarSpacing || ''} onChange={e => handleInputChange('verticalBarSpacing', parseFloat(e.target.value))} unit={inputs.verticalBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('verticalBarSpacingUnit', u)} />
                <Select label={t('inputs.labels.horizontalBarSize')} value={inputs.horizontalBarSize} onChange={e => handleInputChange('horizontalBarSize', e.target.value)}><option value="12mm">12mm</option><option value="16mm">16mm</option><option value="#4">#4</option><option value="#5">#5</option></Select>
                <Input label={t('inputs.labels.spacing')} type="number" value={inputs.horizontalBarSpacing || ''} onChange={e => handleInputChange('horizontalBarSpacing', parseFloat(e.target.value))} unit={inputs.horizontalBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('horizontalBarSpacingUnit', u)} />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.footingReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <Select label={t('inputs.labels.bottomBarSize')} value={inputs.footingBottomBarSize} onChange={e => handleInputChange('footingBottomBarSize', e.target.value)}><option value="12mm">12mm</option><option value="16mm">16mm</option><option value="#4">#4</option><option value="#5">#5</option></Select>
                 <Input label={t('inputs.labels.spacing')} type="number" value={inputs.footingBottomBarSpacing || ''} onChange={e => handleInputChange('footingBottomBarSpacing', parseFloat(e.target.value))} unit={inputs.footingBottomBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('footingBottomBarSpacingUnit', u)} />
                 <Select label={t('inputs.labels.topBarSize')} value={inputs.footingTopBarSize || 'None'} onChange={e => handleInputChange('footingTopBarSize', e.target.value)}><option>None</option><option value="12mm">12mm</option><option value="16mm">16mm</option><option value="#4">#4</option><option value="#5">#5</option></Select>
                 <Input label={t('inputs.labels.spacing')} type="number" value={inputs.footingTopBarSpacing || ''} onChange={e => handleInputChange('footingTopBarSpacing', parseFloat(e.target.value))} unit={inputs.footingTopBarSpacingUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('footingTopBarSpacingUnit', u)} disabled={!inputs.footingTopBarSize || inputs.footingTopBarSize === 'None'}/>
            </div>
        </div>
    </div>
  );

  const tabs = [
    { label: t('tabs.geometry'), content: <GeometryTab /> },
    { label: t('tabs.soilAndLoads'), content: <SoilLoadsTab /> },
    { label: t('tabs.reinforcement'), content: <ReinforcementTab /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAndClear} title={title}>
      {results ? (
        <ResultsPanel results={results} onClear={handleClear} onAddToProject={handleAddToProject} isStabilityCheck={true}/>
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

export default RetainingWallCalculatorModal;
