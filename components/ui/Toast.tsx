
import React, { useState } from 'react';
import type { Toast } from 'react-hot-toast';
import Button from './Button';
import { useI18n } from '../../contexts/I18nContext';

interface CustomToastProps {
  t: Toast;
  title: string;
  message: string;
  onCancel: () => void;
}

interface ConfirmationToastProps extends CustomToastProps {
  onConfirm: () => void;
}

export const ConfirmationToast: React.FC<ConfirmationToastProps> = ({ t, title, message, onConfirm, onCancel }) => {
  const { t: translate } = useI18n();

  return (
    <div
      className={`${
        t.visible ? 'animate-fade-in-up' : 'animate-fade-out'
      } max-w-md w-full bg-surface shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-border`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-text-primary">{title}</p>
            <p className="mt-1 text-sm text-text-secondary">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-l border-border p-2 space-y-2 justify-center">
        <Button onClick={onConfirm} variant="primary" className="w-full !px-3 !py-1.5 text-sm">
          {translate('buttons.confirm')}
        </Button>
        <Button onClick={onCancel} variant="secondary" className="w-full !px-3 !py-1.5 text-sm">
          {translate('buttons.cancel')}
        </Button>
      </div>
    </div>
  );
};

interface PromptToastProps extends CustomToastProps {
    onConfirm: (value: string) => void;
}

export const PromptToast: React.FC<PromptToastProps> = ({ t, title, message, onConfirm, onCancel }) => {
    const { t: translate } = useI18n();
    const [inputValue, setInputValue] = useState('');

    const handleConfirm = () => {
        if (inputValue.trim()) {
            onConfirm(inputValue.trim());
        }
    };

    return (
        <div
            className={`${
                t.visible ? 'animate-fade-in-up' : 'animate-fade-out'
            } max-w-md w-full bg-surface shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-border`}
        >
            <div className="p-4">
                <p className="text-sm font-medium text-text-primary">{title}</p>
                <p className="mt-1 text-sm text-text-secondary">{message}</p>
                <div className="mt-4">
                     <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-surface-secondary/50 border border-border rounded-md p-2 text-text-primary w-full focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                        placeholder={translate('prompts.descriptionPlaceholder')}
                        autoFocus
                        onKeyDown={(e) => {if(e.key === 'Enter') handleConfirm()}}
                    />
                </div>
            </div>
             <div className="flex justify-end items-center bg-surface-secondary/30 p-2 space-x-2 rounded-b-lg border-t border-border">
                <Button onClick={onCancel} variant="secondary" className="!px-3 !py-1.5 text-sm">
                    {translate('buttons.cancel')}
                </Button>
                <Button onClick={handleConfirm} variant="primary" className="!px-3 !py-1.5 text-sm">
                    {translate('buttons.save')}
                </Button>
            </div>
        </div>
    );
};
