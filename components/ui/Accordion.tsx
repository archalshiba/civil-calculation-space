
import React, { useState, useId } from 'react';
import { ChevronDownIcon } from '../icons/Icons';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border border-border rounded-lg bg-surface/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-text-primary hover:bg-surface-secondary/30 transition-colors"
      >
        <span>{title}</span>
        <ChevronDownIcon 
            className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
        />
      </button>
      <div 
        id={panelId}
        role="region"
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ transitionProperty: 'max-height, opacity, padding' }}
      >
        <div className={`p-4 border-t border-border/50 ${isOpen ? 'visible' : 'invisible'}`}>
            {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;