import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getGlobalSettings } from '../utils/settings';
import type { Locale } from '../types';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  getTranslationObject: (key: string) => any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper to get nested property from object by string path
const getNested = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(getGlobalSettings().locale || 'en');
  const [translations, setTranslations] = useState<any>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchTranslations = async (lang: Locale) => {
        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not load translation file for ${lang}`);
            }
            const data = await response.json();
            setTranslations(data);
            setIsLoaded(true);
        } catch (error) {
            console.error(error);
            // Fallback to English if the selected locale fails to load
            if (lang !== 'en') {
                await fetchTranslations('en');
            }
        }
    };
    fetchTranslations(locale);
  }, [locale]);

  const t = useCallback((key: string, options?: { [key: string]: string | number; defaultValue?: string }): string => {
    if (!isLoaded) return options?.defaultValue || key;
    
    let translation = getNested(translations, key);

    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return options?.defaultValue || key;
    }

    if (options) {
      Object.keys(options).forEach(optionKey => {
        if (optionKey !== 'defaultValue') {
          translation = translation.replace(`{{${optionKey}}}`, String(options[optionKey]));
        }
      });
    }

    return translation;
  }, [translations, isLoaded]);
  
  const getTranslationObject = useCallback((key: string) => {
    if (!isLoaded) return {};
    return getNested(translations, key) || {};
  }, [translations, isLoaded]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, getTranslationObject }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
