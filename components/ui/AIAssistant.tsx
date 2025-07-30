

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useI18n } from '../../contexts/I18nContext';
import { useToaster } from '../../contexts/ToasterContext';
import Button from './Button';
import Textarea from './Textarea';
import { SparklesIcon, CloseIcon } from '../icons/Icons';

interface AIAssistantProps {
  onClose: () => void;
  onParse: (data: any) => void;
  systemInstruction: string;
  responseSchema: any;
  placeholder: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose, onParse, systemInstruction, responseSchema, placeholder }) => {
  const { t } = useI18n();
  const toaster = useToaster();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleParse = async () => {
    if (!prompt.trim()) return;

    if (!process.env.API_KEY) {
        toaster.showError("API key is not configured.");
        return;
    }

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const jsonText = response.text;
      const parsedData = JSON.parse(jsonText);
      onParse(parsedData);
      toaster.showSuccess(t('aiAssistant.success'));

    } catch (error) {
      console.error("AI Assistant Error:", error);
      toaster.showError(t('aiAssistant.failure'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-accent/30 rounded-lg p-6 animate-fade-in relative">
        <button
            onClick={onClose}
            className="absolute top-2 right-2 text-text-secondary hover:text-text-primary p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close AI Assistant"
        >
            <CloseIcon className="h-5 w-5" />
        </button>
      <div className="flex items-center mb-4">
        <SparklesIcon className="h-8 w-8 text-accent mr-3" />
        <div>
          <h3 className="text-xl font-bold text-accent">{t('aiAssistant.title')}</h3>
          <p className="text-sm text-text-secondary">{t('aiAssistant.description')}</p>
        </div>
      </div>
      <Textarea
        label=""
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
      <div className="mt-4 flex justify-end">
        <Button onClick={handleParse} loading={isLoading}>
          {isLoading ? t('aiAssistant.parsing') : t('aiAssistant.parseButton')}
        </Button>
      </div>
    </div>
  );
};

export default AIAssistant;