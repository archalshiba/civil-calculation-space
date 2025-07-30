

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { useToaster } from '../contexts/ToasterContext';
import { saveCalculation } from '../utils/storage';
import type { CalculationInputs, CalculationResults, SavedCalculationItem, ValidationErrors } from '../types';

interface UseCalculatorFormProps<TInputs extends CalculationInputs, TResults extends CalculationResults> {
  calculatorTitle: string;
  isOpen: boolean;
  onClose: () => void;
  initialInputs: TInputs;
  calculationFn: (inputs: TInputs) => TResults;
  validationFn: (inputs: TInputs) => ValidationErrors;
  initialOptions?: { [key: string]: any };
}

export function useCalculatorForm<TInputs extends CalculationInputs, TResults extends Partial<CalculationResults>>({
  calculatorTitle,
  isOpen,
  onClose,
  initialInputs,
  calculationFn,
  validationFn,
  initialOptions = {},
}: UseCalculatorFormProps<TInputs, TResults>) {
  const { t } = useI18n();
  const toaster = useToaster();
  const [inputs, setInputs] = useState<TInputs>(initialInputs);
  const [results, setResults] = useState<TResults | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [options, setOptions] = useState(initialOptions);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleClear = useCallback(() => {
    setInputs(initialInputs);
    setResults(null);
    setErrors({});
    setOptions(initialOptions);
    setIsCalculating(false);
  }, [initialInputs, initialOptions]);
  
  // Effect to reset form state when the modal is opened
  useEffect(() => {
    if (isOpen) {
      handleClear();
    }
  }, [isOpen, handleClear]);

  const handleInputChange = (field: keyof TInputs, value: string | number | 'single' | 'double') => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof ValidationErrors]: undefined }));
    }
  };

  const handleUnitChange = (field: keyof TInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleRadioChange = (field: keyof TInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  }

  const handleOptionChange = (field: keyof typeof options, value: any) => {
    setOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    const newErrors = validationFn(inputs);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsCalculating(true);
      setTimeout(() => { // Use setTimeout to allow UI to update to loading state before potentially blocking calculation
        try {
          const calcResults = calculationFn(inputs);
          setResults(calcResults);
        } catch (error) {
            console.error("Calculation failed:", error);
            toaster.showError(t('errors.calculationFailed'));
        } finally {
          setIsCalculating(false);
        }
      }, 50);
    }
  };
  
  const handleCloseAndClear = () => {
      onClose();
      // Delay clear to allow modal to animate out
      setTimeout(handleClear, 300);
  }

  const handleAddToProject = () => {
    if (!results) return;

    toaster.showPrompt(
        t('prompts.enterDescriptionTitle'),
        t('prompts.enterDescriptionMessage', { type: calculatorTitle }),
        (description) => {
            if (description) {
                const newItem: SavedCalculationItem = {
                    id: `calc-${Date.now()}`,
                    timestamp: Date.now(),
                    type: calculatorTitle,
                    description,
                    inputs: inputs,
                    results: results,
                };
                try {
                    saveCalculation(newItem);
                    toaster.showSuccess(t('alerts.calculationSaved', { description }));
                    handleCloseAndClear();
                } catch(e: any) {
                    toaster.showError(e.message);
                }
            }
        }
    );
  };

  return {
    inputs,
    results,
    errors,
    options,
    isCalculating,
    setInputs,
    setOptions,
    handleInputChange,
    handleUnitChange,
    handleRadioChange,
    handleOptionChange,
    handleCalculate,
    handleClear,
    handleAddToProject,
    handleCloseAndClear,
  };
}