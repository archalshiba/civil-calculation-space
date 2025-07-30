
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';
import { getGlobalSettings, saveGlobalSettings, defaultSettings } from '../../utils/settings';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';
import { useToaster } from '../../contexts/ToasterContext';
import type { GlobalSettings, UnitSystem, Theme, Locale } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const toaster = useToaster();

  useEffect(() => {
    if (isOpen) {
      setSettings(getGlobalSettings());
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof GlobalSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleUnitSystemChange = (value: string) => {
    handleInputChange('unitSystem', value as UnitSystem);
  }

  const handleThemeChange = (value: string) => {
    const newTheme = value as Theme;
    setTheme(newTheme);
    setSettings(prev => ({ ...prev, theme: newTheme }));
  }

  const handleLocaleChange = (value: string) => {
    const newLocale = value as Locale;
    setLocale(newLocale);
    setSettings(prev => ({ ...prev, locale: newLocale }));
  }

  const handleSave = () => {
    try {
      saveGlobalSettings(settings);
      onClose();
      toaster.showSuccess(t('alerts.settingsSaved'));
    } catch (e: any) {
      toaster.showError(e.message);
    }
  };

  const tabs = [
    { label: t('tabs.general'), content: (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{t('settings.projectInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label={t('settings.projectName')}
                        type="text"
                        value={settings.projectName}
                        onChange={e => handleInputChange('projectName', e.target.value)}
                    />
                    <Input
                        label={t('settings.projectNumber')}
                        type="text"
                        value={settings.projectNumber}
                        onChange={e => handleInputChange('projectNumber', e.target.value)}
                    />
                </div>
            </div>
            <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">{t('settings.preferences')}</h3>
                 <RadioGroup
                    label={t('settings.unitSystem')}
                    name="unitSystem"
                    options={[
                        { value: 'metric', label: t('settings.metric') },
                        { value: 'imperial', label: t('settings.imperial') }
                    ]}
                    selectedValue={settings.unitSystem}
                    onChange={handleUnitSystemChange}
                />
            </div>
             <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">{t('settings.theme')}</h3>
                 <RadioGroup
                    label={t('settings.appTheme')}
                    name="theme"
                    options={[
                        { value: 'dark', label: t('settings.dark') },
                        { value: 'light', label: t('settings.light') }
                    ]}
                    selectedValue={theme}
                    onChange={handleThemeChange}
                />
            </div>
            <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">{t('settings.language')}</h3>
                 <RadioGroup
                    label={t('settings.appLanguage')}
                    name="locale"
                    options={[
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Español' }
                    ]}
                    selectedValue={locale}
                    onChange={handleLocaleChange}
                />
            </div>
        </div>
    )},
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.titles.settings')}>
      <div className="p-2">
        {tabs[0].content}
      </div>
      <footer className="mt-8 pt-6 border-t border-border flex justify-end space-x-4">
        <Button variant="secondary" onClick={onClose}>{t('buttons.cancel')}</Button>
        <Button variant="primary" onClick={handleSave}>{t('buttons.save')}</Button>
      </footer>
    </Modal>
  );
};

export default SettingsModal;