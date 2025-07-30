
import React, { createContext, useContext, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ConfirmationToast, PromptToast } from '../components/ui/Toast';

type ToastContextType = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
  showPrompt: (title: string, message: string, onConfirm: (value: string) => void) => void;
};

const ToasterContext = createContext<ToastContextType | undefined>(undefined);

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const showConfirmation = useCallback((title: string, message: string, onConfirm: () => void) => {
    toast.custom((t) => (
      <ConfirmationToast
        t={t}
        title={title}
        message={message}
        onConfirm={() => {
          onConfirm();
          toast.dismiss(t.id);
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ), { duration: Infinity, id: `confirm-${Date.now()}` });
  }, []);
  
  const showPrompt = useCallback((title: string, message: string, onConfirm: (value: string) => void) => {
      toast.custom((t) => (
          <PromptToast 
              t={t}
              title={title}
              message={message}
              onConfirm={(value) => {
                  onConfirm(value);
                  toast.dismiss(t.id);
              }}
              onCancel={() => toast.dismiss(t.id)}
          />
      ), { duration: Infinity, id: `prompt-${Date.now()}` });
  }, []);

  return (
    <ToasterContext.Provider value={{ showSuccess, showError, showConfirmation, showPrompt }}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: 'var(--color-surface-tertiary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: 'var(--color-surface)',
            },
          },
           error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: 'var(--color-surface)',
            },
          },
        }}
      />
    </ToasterContext.Provider>
  );
};

export const useToaster = (): ToastContextType => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};
