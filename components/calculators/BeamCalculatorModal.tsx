
import React from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import ResultsPanel from '../ui/ResultsPanel';
import { RectangularBeamSVG, StirrupConfigSVG } from '../icons/SVGSchematics';
import { calculateRectangularBeam } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface BeamCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    width: 300,
    widthUnit: 'mm',
    depth: 500,
    depthUnit: 'mm',
    span: 8,
    spanUnit: 'm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    topBarSize: '16mm',
    topBarCount: 3,
    bottomBarSize: '20mm',
    bottomBarCount: 4,
    transverseType: 'stirrup',
    transverseBarSize: '10mm',
    transverseSpacing: 150,
    transverseSpacingUnit: 'mm',
};

const imperialDefaults: CalculationInputs = {
    width: 12,
    widthUnit: 'in',
    depth: 20,
    depthUnit: 'in',
    span: 25,
    spanUnit: 'ft',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    topBarSize: '#5',
    topBarCount: 3,
    bottomBarSize: '#5',
    bottomBarCount: 4,
    transverseType: 'stirrup',
    transverseBarSize: '#3',
    transverseSpacing: 6,
    transverseSpacingUnit: 'in',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};


const BeamCalculatorModal: React.FC<BeamCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();

  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.width || currentInputs.width <= 0) newErrors.width = t('errors.positiveNumber');
      if (!currentInputs.depth || currentInputs.depth <= 0) newErrors.depth = t('errors.positiveNumber');
      if (!currentInputs.span || currentInputs.span <= 0) newErrors.span = t('errors.positiveNumber');
      if (!currentInputs.topBarCount || currentInputs.topBarCount < 2) newErrors.topBarCount = t('errors.minBars', {count: 2});
      if (!currentInputs.bottomBarCount || currentInputs.bottomBarCount < 2) newErrors.bottomBarCount = t('errors.minBars', {count: 2});
      if (!currentInputs.transverseSpacing || currentInputs.transverseSpacing <= 0) newErrors.transverseSpacing = t('errors.positiveNumber');
      return newErrors;
  }

  const {
      inputs, results, errors, options, isCalculating,
      handleInputChange, handleUnitChange, handleOptionChange,
      handleCalculate, handleClear, handleAddToProject, handleCloseAndClear,
  } = useCalculatorForm<CalculationInputs, CalculationResults>({
      calculatorTitle: title,
      isOpen,
      onClose,
      initialInputs: getDefaultInputs(),
      calculationFn: calculateRectangularBeam,
      validationFn: validateInputs,
      initialOptions: { skinReinforcement: false, integrityReinforcement: false, stirrupType: 'closed' },
  });

  const GeometryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.beamGeometry')}</h3>
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
        <RectangularBeamSVG />
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
        <Select label={t('inputs.labels.exposureClass')}>
          <option>A1</option><option>B1</option><option>C1</option><option>C2</option>
        </Select>
      </div>
    </div>
  );
  
  const LongitudinalReinforcementTab = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.topReinf')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Select 
                    label={t('inputs.labels.barSize')}
                    value={inputs.topBarSize} onChange={e => handleInputChange('topBarSize', e.target.value)}
                >
                    <option value="16mm">16 mm</option><option value="20mm">20 mm</option><option value="25mm">25 mm</option><option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.barCount')} type="number" min="2" 
                    value={inputs.topBarCount || ''} onChange={e => handleInputChange('topBarCount', parseInt(e.target.value))}
                    error={errors.topBarCount}
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
                    <option value="20mm">20 mm</option><option value="25mm">25 mm</option><option value="32mm">32 mm</option><option value="#5">#5</option>
                </Select>
                <Input 
                    label={t('inputs.labels.barCount')} type="number" min="2"
                    value={inputs.bottomBarCount || ''} onChange={e => handleInputChange('bottomBarCount', parseInt(e.target.value))}
                    error={errors.bottomBarCount}
                />
            </div>
        </div>
        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.detailsAndConditions')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input label={t('inputs.labels.clearSpacing')} type="number" unit="mm" units={['mm', 'in']} tooltip={t('tooltips.minClearSpacing')} />
                <Select label={t('inputs.labels.yieldStrength')}><option>420 MPa</option><option>500 MPa</option></Select>
                <div className="md:col-span-2 space-y-2">
                    <Checkbox label={t('inputs.labels.skinReinf')} checked={options.skinReinforcement} onChange={e => handleOptionChange('skinReinforcement', e.target.checked)} />
                    <Checkbox label={t('inputs.labels.integrityReinf')} checked={options.integrityReinforcement} onChange={e => handleOptionChange('integrityReinforcement', e.target.checked)} />
                </div>
            </div>
        </div>
    </div>
  );

  const TransverseReinforcementTab = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.stirrups')}</h3>
            <div className="flex items-center space-x-4">
                <label className={`cursor-pointer p-2 rounded-md ${options.stirrupType === 'closed' ? 'bg-accent text-white' : 'bg-surface-tertiary'}`} onClick={() => handleOptionChange('stirrupType', 'closed')}>{t('inputs.options.closed')}</label>
                <label className={`cursor-pointer p-2 rounded-md ${options.stirrupType === 'open' ? 'bg-accent text-white' : 'bg-surface-tertiary'}`} onClick={() => handleOptionChange('stirrupType', 'open')}>{t('inputs.options.open')}</label>
            </div>
            <Select 
                label={t('inputs.labels.stirrupDiameter')}
                value={inputs.transverseBarSize} onChange={e => handleInputChange('transverseBarSize', e.target.value)}
            >
                <option value="10mm">10 mm</option><option value="12mm">12 mm</option><option value="#3">#3</option><option value="#4">#4</option>
            </Select>
            <Input 
                label={t('inputs.labels.spacing')} type="number" 
                value={inputs.transverseSpacing || ''} onChange={e => handleInputChange('transverseSpacing', parseFloat(e.target.value))}
                unit={inputs.transverseSpacingUnit} onUnitChange={u => handleUnitChange('transverseSpacingUnit', u)}
                tooltip={t('tooltips.stirrupSpacing')}
                error={errors.transverseSpacing}
            />
            <Input label={t('inputs.labels.numLegs')} type="number" placeholder={t('placeholders.example', {value: 2})}/>
            <Select label={t('inputs.labels.hookDetails')}><option>{t('inputs.options.seismicHook')}</option><option>90° Hook</option></Select>
        </div>
        <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.stirrupConfiguration')}</p>
            <StirrupConfigSVG />
      </div>
      </div>
  );

  const LoadsTab = () => (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.loadsAnalysis')}</h3>
        <p className="text-sm text-text-secondary">{t('inputs.loadsAnalysisHint')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('inputs.labels.factoredMoment')} type="number" unit="kN-m" units={['kN-m', 'kip-ft']} disabled />
            <Input label={t('inputs.labels.factoredShear')} type="number" unit="kN" units={['kN', 'kip']} disabled />
            <Input label={t('inputs.labels.factoredTorsion')} type="number" unit="kN-m" units={['kN-m', 'kip-ft']} disabled />
        </div>
      </div>
  );

  const FormworkTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.formworkCalc')}</h3>
            <div className="bg-surface-secondary/50 p-4 rounded-lg">
                <span className="text-text-secondary">{t('results.autoFormworkArea')}: </span>
                <span className="text-xl font-bold text-text-primary">{results?.formworkArea ?? '...'}</span>
            </div>
        </div>
    );

  const tabs = [
    { label: t('tabs.geometry'), content: <GeometryTab /> },
    { label: t('tabs.materials'), content: <MaterialTab /> },
    { label: t('tabs.longitudinalReinf'), content: <LongitudinalReinforcementTab /> },
    { label: t('tabs.transverseStirrups'), content: <TransverseReinforcementTab /> },
    { label: t('tabs.loadsAnalysis'), content: <LoadsTab /> },
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

export default BeamCalculatorModal;