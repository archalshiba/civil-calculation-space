import React from 'react';
import { MenuIcon, UserCircleIcon, CogIcon, LogoIcon } from '../icons/Icons';
import { useI18n } from '../../contexts/I18nContext';

interface HeaderProps {
  onMenuClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSettingsClick }) => {
  const { t } = useI18n();

  return (
    <header className="bg-surface border-b border-border flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent md:hidden"
          >
            <span className="sr-only">{t('header.openSidebar')}</span>
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="hidden md:flex items-center space-x-2 ml-4">
             <LogoIcon className="h-8 w-8 text-accent"/>
             <span className="text-xl font-bold text-text-primary">{t('header.appName')}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
            <button 
                onClick={onSettingsClick}
                className="p-1 rounded-full text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-white"
            >
                <span className="sr-only">{t('header.openSettings')}</span>
                <CogIcon className="h-6 w-6"/>
            </button>
            <button className="p-1 rounded-full text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-white">
                <span className="sr-only">{t('header.openProfile')}</span>
                <UserCircleIcon className="h-6 w-6"/>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;