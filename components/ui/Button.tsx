

import React from 'react';
import { SpinnerIcon } from '../icons/Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', loading = false, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-blue-600 focus:ring-accent',
    secondary: 'bg-surface-tertiary text-text-primary hover:bg-border focus:ring-gray-500',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={loading || props.disabled}
      aria-busy={loading}
      {...props}
    >
      {loading && <SpinnerIcon className="animate-spin -ml-1 mr-2 h-5 w-5" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;