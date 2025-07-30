
import React, { useId } from 'react';
import { InformationCircleIcon } from '../icons/Icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  units?: string[];
  onUnitChange?: (unit: string) => void;
  tooltip?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, unit, units, onUnitChange, tooltip, error, ...props }) => {
  const inputId = useId();
  const errorId = error ? `${inputId}-error` : undefined;
  const tooltipId = tooltip ? `${inputId}-tooltip` : undefined;
  
  const describedBy = [errorId, tooltipId].filter(Boolean).join(' ');

  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const baseClasses = 'border-border focus:border-accent focus:ring-accent';

  return (
    <div className="flex flex-col">
      <label htmlFor={inputId} className="mb-1 text-sm font-medium text-text-secondary flex items-center">
        {label}
        {tooltip && (
          <span className="ml-2 group relative">
            <InformationCircleIcon className="h-4 w-4 text-text-secondary/70" aria-hidden="true" />
            <span
              id={tooltipId}
              role="tooltip"
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-text-primary bg-surface-tertiary rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
            >
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="flex items-stretch">
        <input
          id={inputId}
          className={`bg-surface-secondary/50 border rounded-l-md p-2 text-text-primary flex-grow focus:outline-none transition-colors ${error ? errorClasses : baseClasses}`}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          {...props}
        />
        {units && onUnitChange && unit && (
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className={`bg-surface-tertiary border-y border-r rounded-r-md p-2 text-text-secondary focus:outline-none ${error ? 'border-red-500' : 'border-border'}`}
            aria-label={`Unit for ${label}`}
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        )}
      </div>
      {error && <p id={errorId} className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>}
    </div>
  );
};

export default Input;