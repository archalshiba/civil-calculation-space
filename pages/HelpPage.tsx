import React from 'react';
import Accordion from '../components/ui/Accordion';
import HelpAssistant from '../components/ui/HelpAssistant';
import { useI18n } from '../contexts/I18nContext';

// Helper component to render simple markdown-style bold text
const FormattedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </p>
  );
};


const HelpPage: React.FC = () => {
  const { t, getTranslationObject } = useI18n();
  const faqItems = getTranslationObject('help.faqs');
  const disclaimer = getTranslationObject('help.disclaimer');

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-2">{t('help.pageTitle')}</h1>
      <p className="text-text-secondary mb-8">
        {t('help.pageSubtitle')}
      </p>

      <div className="bg-surface border border-border rounded-lg shadow-lg mb-12">
        <HelpAssistant />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">{t('help.faqTitle')}</h2>
        <div className="space-y-4">
          {Array.isArray(faqItems) && faqItems.map((item, index) => (
              <Accordion key={index} title={item.question}>
                  <p className="text-text-secondary leading-relaxed">{item.answer}</p>
              </Accordion>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 border border-accent/50 bg-accent/10 rounded-lg">
        <h2 className="text-2xl font-bold text-accent mb-4">{disclaimer.title}</h2>
        <div className="space-y-4">
            <FormattedText text={disclaimer.codeVersion} className="text-text-secondary leading-relaxed" />
            <FormattedText text={disclaimer.purpose} className="text-text-secondary leading-relaxed" />
            <FormattedText text={disclaimer.verification} className="text-text-secondary leading-relaxed" />
        </div>
      </div>

    </div>
  );
};

export default HelpPage;
