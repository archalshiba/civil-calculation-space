import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';
import type { NavItem } from '../../types';
import { LogoIcon } from '../icons/Icons';
import { useI18n } from '../../contexts/I18nContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useI18n();
  const baseLinkClass = "flex items-center px-4 py-3 text-text-secondary rounded-lg hover:bg-surface-tertiary transition-colors duration-200";
  const activeLinkClass = "bg-primary text-white";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`flex-shrink-0 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 ease-in-out z-30
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                   absolute md:relative md:translate-x-0 h-full`}
      >
        <div className="flex items-center justify-center h-16 border-b border-border flex-shrink-0 px-4">
          <div className="flex items-center space-x-3">
              <LogoIcon className="h-10 w-10 text-accent"/>
              <span className="text-lg font-semibold text-text-primary whitespace-nowrap">{t('sidebar.appName')}</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul>
            {NAV_ITEMS.map((item: NavItem) => (
              <li key={item.nameKey} className="mb-2">
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{t(item.nameKey)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-border mt-auto">
            <p className="text-xs text-text-secondary/80">{t('sidebar.copyright')}</p>
            <p className="text-xs text-text-secondary/80">{t('sidebar.version')}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;