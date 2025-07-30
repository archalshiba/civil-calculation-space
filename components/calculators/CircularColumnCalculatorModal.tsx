

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
import { CircularColumnSVG, SpiralReinforcementSVG, TieShapeSVG } from '../icons/SVGSchematics';
import { SparklesIcon } from '../icons/Icons';
import { calculateCircularColumn } from '../../utils/calculations';
import { getGlobalSettings } from '../../utils/settings';
import { useI18n } from '../../contexts/I18nContext';
import { useCalculatorForm } from '../../hooks/useCalculatorForm';
import { toSI } from '../../utils/units';
import type { CalculationInputs, CalculationResults, ValidationErrors } from '../../types';

interface CircularColumnCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const metricDefaults: CalculationInputs = {
    diameter: 500,
    diameterUnit: 'mm',
    height: 3,
    heightUnit: 'm',
    concreteUnitWeight: 2400,
    concreteUnitWeightUnit: 'kg/m³',
    longitudinalBarSize: '20mm',
    longitudinalBarCount: 6,
    transverseType: 'spiral',
    transverseBarSize: '10mm',
    pitch: 75,
    pitchUnit: 'mm',
    transverseSpacing: 150,
    transverseSpacingUnit: 'mm',
};

const imperialDefaults: CalculationInputs = {
    diameter: 20,
    diameterUnit: 'in',
    height: 10,
    heightUnit: 'ft',
    concreteUnitWeight: 150,
    concreteUnitWeightUnit: 'lb/ft³',
    longitudinalBarSize: '#5',
    longitudinalBarCount: 6,
    transverseType: 'spiral',
    transverseBarSize: '#3',
    pitch: 3,
    pitchUnit: 'in',
    transverseSpacing: 6,
    transverseSpacingUnit: 'in',
};

const getDefaultInputs = (): CalculationInputs => {
    const settings = getGlobalSettings();
    return settings.unitSystem === 'imperial' ? imperialDefaults : metricDefaults;
};

const aiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    diameter: { type: Type.NUMBER, description: 'The diameter of the column in millimeters.' },
    height: { type: Type.NUMBER, description: 'The height of the column in meters.' },
    longitudinalBarCount: { type: Type.INTEGER, description: 'The total number of longitudinal reinforcement bars.' },
  },
};

const CircularColumnCalculatorModal: React.FC<CircularColumnCalculatorModalProps> = ({ isOpen, onClose, title }) => {
  const { t } = useI18n();
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);

  const validateInputs = (currentInputs: CalculationInputs): ValidationErrors => {
      const newErrors: ValidationErrors = {};
      if (!currentInputs.diameter || currentInputs.diameter <= 0) newErrors.diameter = t('errors.positiveNumber');
      if (!currentInputs.height || currentInputs.height <= 0) newErrors.height = t('errors.positiveNumber');
      
      if (!currentInputs.longitudinalBarCount) {
        newErrors.longitudinalBarCount = t('errors.positiveNumber');
      } else if (currentInputs.transverseType === 'spiral' && currentInputs.longitudinalBarCount < 6) {
          newErrors.longitudinalBarCount = t('errors.minSpiralBars');
      } else if (currentInputs.transverseType === 'tied' && currentInputs.longitudinalBarCount < 4) {
          newErrors.longitudinalBarCount = t('errors.minBars', { count: 4 });
      }

      if (currentInputs.transverseType === 'spiral') {
        if (!currentInputs.pitch || currentInputs.pitch <= 0) {
            newErrors.pitch = t('errors.positiveNumber');
        } else {
            const pitch_mm = toSI(currentInputs.pitch, currentInputs.pitchUnit) * 1000;
            if (pitch_mm < 25 || pitch_mm > 75) {
                newErrors.pitch = t('errors.spiralPitchRange');
            }
        }
      }
      
      if (currentInputs.transverseType === 'tied' && (!currentInputs.transverseSpacing || currentInputs.transverseSpacing <= 0)) {
        newErrors.transverseSpacing = t('errors.positiveNumber');
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
      calculationFn: calculateCircularColumn,
      validationFn: validateInputs,
      initialOptions: { offsetBentBars: false, bundledBars: false, seismicHooks: true },
  });
  
  const handleAiParse = (data: any) => {
    const newInputs: Partial<CalculationInputs> = {};
    if (data.diameter) {
        newInputs.diameter = data.diameter;
        newInputs.diameterUnit = 'mm';
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
            label={t('inputs.labels.diameter')} type="number" 
            value={inputs.diameter || ''} onChange={e => handleInputChange('diameter', parseFloat(e.target.value))}
            unit={inputs.diameterUnit} units={['mm', 'in']} onUnitChange={u => handleUnitChange('diameterUnit', u)}
            error={errors.diameter}
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
        <CircularColumnSVG />
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
            value={inputs.longitudinalBarSize} onChange={e => handleInputChange('longitudinalBarSize', e.target.value)}
        >
            <option value="16mm">16 mm</option><option value="20mm">20 mm</option><option value="25mm">25 mm</option><option value="#4">#4</option><option value="#5">#5</option>
        </Select>
        <Input 
            label={t('inputs.labels.barCount')} type="number" min="4" 
            value={inputs.longitudinalBarCount || ''} onChange={e => handleInputChange('longitudinalBarCount', parseInt(e.target.value))}
            error={errors.longitudinalBarCount}
        />
        <Select label={t('inputs.labels.yieldStrength')}>
            <option>420 MPa</option><option>500 MPa</option><option>60 ksi</option>
        </Select>
        <Input label={t('inputs.labels.developmentLength')} type="number" unit="mm" units={['mm', 'in']} tooltip={t('tooltips.aciRef')}/>
        <div className="space-y-4 md:col-span-2 mt-4 border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('inputs.sections.specialConditions')}</h3>
        </div>
        <div className="md:col-span-2 space-y-4">
            <Checkbox label={t('inputs.labels.offsetBentBars')} checked={options.offsetBentBars} onChange={(e) => handleOptionChange('offsetBentBars', e.target.checked)} />
        </div>
         <div className="md:col-span-2 space-y-4">
            <Checkbox label={t('inputs.labels.bundledBars')} checked={options.bundledBars} onChange={(e) => handleOptionChange('bundledBars', e.target.checked)} />
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
                options={[{value: 'tied', label: t('inputs.options.tiedHoop')}, {value: 'spiral', label: t('inputs.options.spiral')}]}
                selectedValue={inputs.transverseType}
                onChange={(val) => handleInputChange('transverseType', val)}
            />
            <Select 
                label={inputs.transverseType === 'spiral' ? t('inputs.labels.spiralDiameter') : t('inputs.labels.tieDiameter')}
                value={inputs.transverseBarSize}
                onChange={e => handleInputChange('transverseBarSize', e.target.value)}
            >
                <option value="10mm">10 mm</option><option value="12mm">12 mm</option><option value="#3">#3</option><option value="#4">#4</option>
            </Select>
            <Input 
                label={inputs.transverseType === 'spiral' ? t('inputs.labels.pitch') : t('inputs.labels.spacing')} 
                type="number" 
                value={inputs.transverseType === 'spiral' ? (inputs.pitch || '') : (inputs.transverseSpacing || '')}
                unit={inputs.transverseType === 'spiral' ? inputs.pitchUnit : inputs.transverseSpacingUnit}
                units={['mm', 'in']}
                tooltip={t('tooltips.validateSpacing')}
                error={inputs.transverseType === 'spiral' ? errors.pitch : errors.transverseSpacing}
                onChange={e => {
                    const field = inputs.transverseType === 'spiral' ? 'pitch' : 'transverseSpacing';
                    handleInputChange(field, parseFloat(e.target.value));
                }}
                onUnitChange={u => {
                    const field = inputs.transverseType === 'spiral' ? 'pitchUnit' : 'transverseSpacingUnit';
                    handleUnitChange(field, u);
                }}
            />
            
            {inputs.transverseType === 'tied' && (
                <div className="space-y-4 animate-fade-in">
                    <Select label={t('inputs.labels.configuration')}><option>{t('inputs.options.circularHoop')}</option></Select>
                     <Select label={t('inputs.labels.hookAngle')}><option>90°</option><option>135°</option><option>180°</option></Select>
                    <Checkbox label={t('inputs.labels.provideSeismicHooks')} checked={options.seismicHooks} onChange={(e) => handleOptionChange('seismicHooks', e.target.checked)} />
                </div>
            )}

            <Textarea label={t('inputs.labels.confinementNotes')} placeholder={t('placeholders.confinementNotes')}/>
        </div>
        <div className="flex flex-col items-center justify-center bg-surface-secondary/50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-text-secondary mb-2">{t('common.reinfConfiguration')}</p>
            {inputs.transverseType === 'spiral' ? <SpiralReinforcementSVG /> : <TieShapeSVG />}
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
        </div>
    );


  const tabs = [
    { label: t('tabs.dimensions'), content: <DimensionsTab /> },
    { label: t('tabs.materials'), content: <MaterialTab /> },
    { label: t('tabs.longitudinalReinf'), content: <LongitudinalReinforcementTab /> },
    { label: t('tabs.transverseReinf'), content: <TransverseReinforcementTab /> },
    { label: t('tabs.formwork'), content: <FormworkTab /> },
  ];
  
  const aiSystemInstruction = "You are an expert civil engineering assistant. Your role is to parse the user's text to extract parameters for a circular concrete column. Be precise. If a value is ambiguous, do not guess. Convert all dimensions to the units specified in the JSON schema (diameter in mm, height in m). Return only the JSON object.";

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAndClear} title={title}>
        {results ? (
            <ResultsPanel results={results} onClear={handleClear} onAddToProject={handleAddToProject} />
        ) : (
            <>
                <div className="mb-6">
                    {isAiAssistantOpen ? (
                        <AIAssistant
                            onClose={() => setAiAssistantOpen(false)}
                            onParse={handleAiParse}
                            systemInstruction={aiSystemInstruction}
                            responseSchema={aiResponseSchema}
                            placeholder={t('aiAssistant.placeholderCircColumn')}
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

export default CircularColumnCalculatorModal;