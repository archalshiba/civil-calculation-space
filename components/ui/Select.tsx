import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-text-secondary">{label}</label>
      <select
        className="w-full bg-surface-secondary/50 border border-border rounded-md p-2 text-text-primary focus:ring-accent focus:border-accent focus:outline-none"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;