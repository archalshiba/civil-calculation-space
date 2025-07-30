import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-secondary">{label}</label>
      <div className="flex items-center space-x-4 rounded-md bg-surface-secondary/50 p-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex-1 text-center px-4 py-2 rounded-md cursor-pointer transition-colors text-sm font-semibold ${
              selectedValue === option.value ? 'bg-accent text-white shadow' : 'text-text-secondary hover:bg-surface-tertiary'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;