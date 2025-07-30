
import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import SettingsModal from './components/layout/SettingsModal';
import HomePage from './pages/HomePage';
import CalculatorsPage from './pages/CalculatorsPage';
import ProjectsPage from './pages/ProjectsPage';
import ReportsPage from './pages/ReportsPage';
import HelpPage from './pages/HelpPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { ToasterProvider } from './contexts/ToasterContext';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <ThemeProvider>
      <I18nProvider>
        <ToasterProvider>
          <HashRouter>
            <div className="flex h-screen bg-background">
              <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} onSettingsClick={() => setSettingsOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-secondary/50 p-4 md:p-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/calculators" element={<CalculatorsPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/help" element={<HelpPage />} />
                  </Routes>
                </main>
              </div>
              <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
            </div>
          </HashRouter>
        </ToasterProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;