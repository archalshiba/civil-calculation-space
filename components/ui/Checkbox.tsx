import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 rounded bg-surface-secondary/50 border-border text-accent focus:ring-accent focus:ring-offset-surface"
        {...props}
      />
      <span className="text-text-primary font-medium">{label}</span>
    </label>
  );
};

export default Checkbox;