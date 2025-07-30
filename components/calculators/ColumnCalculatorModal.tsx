

import React, { useState } from 'react';
import { Type } from '@google/genai';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import RadioGroup from '../ui/RadioGroup';
import Textarea from '../ui/Textarea';
import ResultsPanel from '../ui/ResultsPanel';
import AIAssistant from '../ui/AIAssistant';
import { RectangularColumnSVG, BundledBarsSVG, TieShapeSVG } from '../icons/SVGSchematics';
import { SparklesIcon } from '../icons/Icons';
import { calculateRectangularColumn } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import { BAR_DATA } from '../../data/rebar';
import { toSI } from '../../utils/units';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface ColumnCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    width: 400,
    widthUnit: 'mm',
    depth: 400,
    depthUnit: 'mm',
    height: 3,
    heightUnit: 'm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    longitudinalBarSize: '16mm',
    longitudinalBarCount: 8,
    transverseType: 'tied',
    transverseBarSize: '10mm',
    transverseSpacing: 200,
    transverseSpacingUnit: 'mm',
};

const imperialDefaults: CalculationInputs = {
    width: 16,
    widthUnit: 'in',
    depth: 16,
    depthUnit: 'in',
    height: 10,
    heightUnit: 'ft',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    longitudinalBarSize: '#5',
    longitudinalBarCount: 8,
    transverseType: 'tied',
    transverseBarSize: '#3',
    transverseSpacing: 8,
    transverseSpacingUnit: 'in',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
}

const aiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    width: { type: Type.NUMBER, description: 'The width of the column in millimeters.' },
    depth: { type: Type.NUMBER, description: 'The depth of the column in millimeters.' },
    height: { type: Type.NUMBER, description: 'The height of the column in meters.' },
    longitudinalBarCount: { type: Type.INTEGER, description: 'The total number of longitudinal reinforcement bars.' },
  },
};

const ColumnCalculatorModal: React.FC<ColumnCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);

  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    if (!currentInputs.width || currentInputs.width <= 0) newErrors.width = t('errors.positiveNumber');
    if (!currentInputs.depth || currentInputs.depth <= 0) newErrors.depth = t('errors.positiveNumber');
    if (!currentInputs.height || currentInputs.height <= 0) newErrors.height = t('errors.positiveNumber');
    if (!currentInputs.longitudinalBarCount || currentInputs.longitudinalBarCount < 4) newErrors.longitudinalBarCount = t('errors.minBars', {count: 4});
    
    if (!currentInputs.transverseSpacing || currentInputs.transverseSpacing <= 0) {
      newErrors.transverseSpacing = t('errors.positiveNumber');
    } else if (currentInputs.longitudinalBarSize && currentInputs.transverseBarSize && currentInputs.width && currentInputs.depth) {
        const longBarDiameter_mm = BAR_DATA[currentInputs.longitudinalBarSize]?.diameter_mm;
        const tieBarDiameter_mm = BAR_DATA[currentInputs.transverseBarSize]?.diameter_mm;
        const width_mm = toSI(currentInputs.width, currentInputs.widthUnit) * 1000;
        const depth_mm = toSI(currentInputs.depth, currentInputs.depthUnit) * 1000;
        const spacing_mm = toSI(currentInputs.transverseSpacing, currentInputs.transverseSpacingUnit) * 1000;

        if (longBarDiameter_mm && tieBarDiameter_mm) {
            const maxSpacing1 = 16 * longBarDiameter_mm;
            const maxSpacing2 = 48 * tieBarDiameter_mm;
            const maxSpacing3 = Math.min(width_mm, depth_mm);
            const maxAllowed = Math.min(maxSpacing1, maxSpacing2, maxSpacing3);
            if (spacing_mm > maxAllowed) {
                newErrors.transverseSpacing = t('errors.maxTieSpacing', { max: Math.round(maxAllowed) });
            }
        }
    }
    return newErrors;
  }

  const {
      inputs, results, errors, options, isCalculating, setInputs,
      handleInputChange, handleUnitChange, handleOptionChange,
      handleCalculate, handleClear, handleAddToProject, handleCloseAndClear,
  } = useCalculatorForm<CalculationInputs, CalculationResults>({
      calculatorTitle: title,
      isOpen,
      onClose,
      initialInputs: getDefaultInputs(),
      calculationFn: calculateRectangularColumn,
      validationFn: validateInputs,
      initialOptions: { offsetBentBars: false, bundledBars: false, seismicHooks: true },
  });
  
  const handleAiParse = (data: any) => {
    const newInputs: Partial<CalculationInputs> = {};
    if (data.width) {
        newInputs.width = data.width;
        newInputs.widthUnit = 'mm';
    }
    if (data.depth) {
        newInputs.depth = data.depth;
        newInputs.depthUnit = 'mm';
    }
     if (data.height) {
        newInputs.height = data.height;
        newInputs.heightUnit = 'm';
    }
    if(data.longitudinalBarCount) {
        newInputs.longitudinalBarCount = data.longitudinalBarCount;
    }
    
    setInputs(prev => ({ ...prev, ...newInputs }));
    setAiAssistantOpen(false);
  };

  const DimensionsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.dimensions')}</h3>
        <Input 
            label={t('inputs.labels.width')} type="number"
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
            label={t('inputs.labels.height')} type="number"
            value={inputs.height || ''} onChange={e => handleInputChange('height', parseFloat(e.target.value))}
            unit={inputs.heightUnit} units={['m', 'ft']} onUnitChange={u => handleUnitChange('heightUnit', u)}
            error={errors.height}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg">
        <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.schematicView')}</p>
        <RectangularColumnSVG width={inputs.width} depth={inputs.depth}/>
      </div>
    </div>
  );

  const MaterialTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.materials')}</h3>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.longitudinalMain')}</h3>
        </div>
        <Select 
            label={t('inputs.labels.barSize')}
            value={inputs.longitudinalBarSize}
            onChange={e => handleInputChange('longitudinalBarSize', e.target.value)}
        >
            <option value="16mm">16 mm</option>
            <option value="20mm">20 mm</option>
            <option value="25mm">25 mm</option>
            <option value="#4">#4</option>
            <option value="#5">#5</option>
        </Select>
        <Input 
            label={t('inputs.labels.barCount')} type="number" min="4"
            value={inputs.longitudinalBarCount || ''}
            onChange={e => handleInputChange('longitudinalBarCount', parseInt(e.target.value, 10))}
            error={errors.longitudinalBarCount}
        />
        <Select label={t('inputs.labels.yieldStrength')}>
            <option>420 MPa</option><option>500 MPa</option><option>60 ksi</option>
        </Select>
        <Input label={t('inputs.labels.developmentLength')} type="number" unit="mm" units={['mm', 'in']} tooltip={t('tooltips.developmentLength')} />

        <div className="space-y-4 md:col-span-2 mt-4 border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.splicing')}</h3>
        </div>
        <Input label={t('inputs.labels.lapSpliceLength')} type="number" placeholder={t('placeholders.example', {value: 800})} unit="mm" units={['mm', 'in']} />
        <Select label={t('inputs.labels.spliceType')}><option>Class A</option><option>Class B</option></Select>
        <Select label={t('inputs.labels.spliceLocation')}><option>Mid-height</option><option>Base</option></Select>
        <Select label={t('inputs.labels.staggeringPattern')}><option>50% staggered</option><option>100% at section</option></Select>

        <div className="space-y-4 md:col-span-2 mt-4 border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.specialConditions')}</h3>
        </div>
        <div className="md:col-span-2 space-y-4">
            <Checkbox label={t('inputs.labels.offsetBentBars')} checked={options.offsetBentBars} onChange={(e) => handleOptionChange('offsetBentBars', e.target.checked)} />
            {options.offsetBentBars && (
                 <div className="grid grid-cols-2 gap-4 pl-8 animate-fade-in">
                    <Input label={t('inputs.labels.bendHeight')} type="number" unit="mm" units={['mm', 'in']}/>
                    <Input label={t('inputs.labels.slope')} type="number" placeholder={t('placeholders.example', {value: 6})}/>
                 </div>
            )}
        </div>
         <div className="md:col-span-2 space-y-4">
            <Checkbox label={t('inputs.labels.bundledBars')} checked={options.bundledBars} onChange={(e) => handleOptionChange('bundledBars', e.target.checked)} />
            {options.bundledBars && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8 animate-fade-in">
                    <Select label={t('inputs.labels.barsPerBundle')}><option>2</option><option>3</option><option>4</option></Select>
                    <Input label={t('inputs.labels.equivalentDiameter')} type="number" unit="mm" units={['mm', 'in']}/>
                    <div className="flex items-end justify-center"><BundledBarsSVG /></div>
                 </div>
            )}
        </div>
    </div>
  );

  const TransverseReinforcementTab = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.transverseTiesSpirals')}</h3>
            <RadioGroup
                label={t('inputs.labels.reinfType')}
                name="transverseType"
                options={[{value: 'tied', label: t('inputs.options.tied')}, {value: 'spiral', label: t('inputs.options.spiral')}]}
                selectedValue={inputs.transverseType}
                onChange={(val) => handleInputChange('transverseType', val)}
            />
            <Select 
                label={t('inputs.labels.tieHoopDiameter')}
                value={inputs.transverseBarSize}
                onChange={e => handleInputChange('transverseBarSize', e.target.value)}
            >
                <option value="10mm">10 mm</option>
                <option value="12mm">12 mm</option>
                <option value="#3">#3</option>
                <option value="#4">#4</option>
            </Select>
            <Input 
                label={t('inputs.labels.spacing')} type="number" 
                value={inputs.transverseSpacing || ''}
                onChange={e => handleInputChange('transverseSpacing', parseFloat(e.target.value))}
                unit={inputs.transverseSpacingUnit}
                units={['mm', 'in']}
                onUnitChange={u => handleUnitChange('transverseSpacingUnit', u)}
                tooltip={t('tooltips.tieSpacing')}
                error={errors.transverseSpacing}
            />
            <Select label={t('inputs.labels.configuration')}>
                <option>{t('inputs.options.rectangular')}</option>
                <option>{t('inputs.options.circular')}</option>
                <option>{t('inputs.options.overlappingHoops')}</option>
                <option>{t('inputs.options.multiLeg')}</option>
            </Select>
             <Select label={t('inputs.labels.hookAngle')}>
                <option>90°</option><option>135°</option><option>180°</option>
            </Select>
            <Checkbox label={t('inputs.labels.provideSeismicHooks')} checked={options.seismicHooks} onChange={(e) => handleOptionChange('seismicHooks', e.target.checked)} />
            <Textarea label={t('inputs.labels.confinementNotes')} placeholder={t('placeholders.confinementNotes')}/>
        </div>
        <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.tieConfiguration')}</p>
            <TieShapeSVG />
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
            <Input label={t('inputs.labels.wastageAdjustment')} type="number" placeholder={t('placeholders.example', {value: 5})} unit="%" units={['%']} />

            <div>
                <h4 className="text-md font-semibold text-text-primary mb-2">{t('inputs.sections.componentChecklist')}</h4>
                <div className="space-y-2">
                    <Checkbox label={t('inputs.labels.sidePanels')} defaultChecked/>
                    <Checkbox label={t('inputs.labels.joists')} defaultChecked/>
                    <Checkbox label={t('inputs.labels.shoring')} defaultChecked/>
                </div>
            </div>
        </div>
    );

  const tabs = [
    { label: t('tabs.dimensions'), content: <DimensionsTab /> },
    { label: t('tabs.materials'), content: <MaterialTab /> },
    { label: t('tabs.longitudinalReinf'), content: <LongitudinalReinforcementTab /> },
    { label: t('tabs.transverseReinf'), content: <TransverseReinforcementTab /> },
    { label: t('tabs.formwork'), content: <FormworkTab /> },
  ];

  const aiSystemInstruction = "You are an expert civil engineering assistant. Your role is to parse the user's text to extract parameters for a rectangular concrete column. Be precise. If a value is ambiguous, do not guess. Convert all dimensions to the units specified in the JSON schema (width/depth in mm, height in m). Return only the JSON object.";

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAndClear} title={title}>
        {results ? (
            <ResultsPanel results={results} onClear={handleClear} onAddToProject={handleAddToProject}/>
        ) : (
            <>
                <div className="mb-6">
                    {isAiAssistantOpen ? (
                        <AIAssistant
                            onClose={() => setAiAssistantOpen(false)}
                            onParse={handleAiParse}
                            systemInstruction={aiSystemInstruction}
                            responseSchema={aiResponseSchema}
                            placeholder={t('aiAssistant.placeholderRectColumn')}
                        />
                    ) : (
                        <Tabs tabs={tabs} />
                    )}
                </div>
                <footer className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                    <div>
                        <Button 
                            variant="secondary" 
                            onClick={() => setAiAssistantOpen(!isAiAssistantOpen)}
                            className="flex items-center space-x-2"
                        >
                            <SparklesIcon className="h-5 w-5" />
                            <span>{t('buttons.aiAssistant')}</span>
                        </Button>
                    </div>
                    <div className="flex space-x-4">
                        <Button variant="secondary" onClick={handleClear}>{t('buttons.clear')}</Button>
                        <Button variant="primary" onClick={handleCalculate} loading={isCalculating}>{t('buttons.calculate')}</Button>
                    </div>
                </footer>
            </>
        )}
    </Modal>
  );
};

export default ColumnCalculatorModal;