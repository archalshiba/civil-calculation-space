
import React, { useEffect, useRef, useId } from 'react';
import { CloseIcon } from '../icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      modalRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }

        if (event.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
          );
          if (!focusableElements) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) { // Shift+Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (triggerRef.current instanceof HTMLElement) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 id={titleId} className="text-xl font-bold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={`Close ${title} modal`}
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>
        <div className="flex-grow overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;