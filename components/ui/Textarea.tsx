import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-text-secondary">{label}</label>
      <textarea
        className="w-full bg-surface-secondary/50 border border-border rounded-md p-2 text-text-primary focus:ring-accent focus:border-accent focus:outline-none"
        rows={4}
        {...props}
      ></textarea>
    </div>
  );
};

export default Textarea;