
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getSavedCalculations, deleteCalculation, overwriteProject } from '../utils/storage';
import { getGlobalSettings } from '../utils/settings';
import type { SavedCalculationItem } from '../types';
import SavedCalculationCard from '../components/ui/SavedCalculationCard';
import DetailedCalculationSheetModal from '../components/reports/DetailedCalculationSheetModal';
import { FolderOpenIcon, UploadIcon, DocumentDownloadIcon } from '../components/icons/Icons';
import Button from '../components/ui/Button';
import { useI18n } from '../contexts/I18nContext';
import { useToaster } from '../contexts/ToasterContext';

const ProjectsPage: React.FC = () => {
  const { t } = useI18n();
  const toaster = useToaster();
  const [savedItems, setSavedItems] = useState<SavedCalculationItem[]>([]);
  const [detailedViewItem, setDetailedViewItem] = useState<SavedCalculationItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSavedItems(getSavedCalculations());
  }, []);

  const handleDelete = (id: string, description: string) => {
    toaster.showConfirmation(
      t('prompts.confirmDeleteTitle'),
      t('prompts.confirmDeleteMessage', { item: description }),
      () => {
        try {
          const updatedItems = deleteCalculation(id);
          setSavedItems(updatedItems);
          toaster.showSuccess(t('alerts.itemDeleted'));
        } catch (e: any) {
          toaster.showError(e.message);
        }
      }
    );
  };

  const handleViewDetails = (item: SavedCalculationItem) => {
    setDetailedViewItem(item);
  };

  const handleCloseDetails = () => {
    setDetailedViewItem(null);
  };

  const handleExportProject = () => {
    const projectData = getSavedCalculations();
    if (projectData.length === 0) {
      toaster.showError(t('alerts.noDataToExport'));
      return;
    }
    
    const settings = getGlobalSettings();
    const projectName = settings.projectName.replace(/\s/g, '_') || 'project';
    const date = new Date().toISOString().split('T')[0];
    const fileName = `CivilCalc_${projectName}_${date}.json`;
    
    const jsonString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            const data = JSON.parse(text);

            if (!Array.isArray(data) || (data.length > 0 && !data.every(item => item.id && item.type && item.inputs && item.results))) {
                throw new Error(t('errors.invalidProjectFile'));
            }

            toaster.showConfirmation(
                t('prompts.confirmImportTitle'),
                t('prompts.confirmImportMessage'),
                () => {
                    try {
                        overwriteProject(data);
                        setSavedItems(getSavedCalculations());
                        toaster.showSuccess(t('alerts.importSuccess', {count: data.length}));
                    } catch (e: any) {
                        toaster.showError(e.message);
                    }
                }
            );

        } catch (error: any) {
            console.error("Failed to import project:", error);
            toaster.showError(t('alerts.importFailed', {error: error.message}));
        } finally {
            if (event.target) {
                event.target.value = "";
            }
        }
    };
    reader.onerror = () => {
        toaster.showError(t('alerts.fileReadError'));
         if (event.target) {
            event.target.value = "";
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-fade-in">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">{t('projects.pageTitle')}</h1>
                <p className="text-text-secondary">
                    {t('projects.pageSubtitle')}
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Button onClick={handleImportClick} variant="secondary" className="flex items-center">
                    <UploadIcon className="h-5 w-5 mr-2" />
                    <span>{t('buttons.import')}</span>
                </Button>
                <Button onClick={handleExportProject} variant="secondary" className="flex items-center">
                    <DocumentDownloadIcon className="h-5 w-5 mr-2" />
                    <span>{t('buttons.export')}</span>
                </Button>
            </div>
        </div>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json"
            className="hidden"
        />

      {savedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-16 bg-surface/50 border-2 border-dashed border-border rounded-lg py-16 px-6">
          <FolderOpenIcon className="h-16 w-16 text-text-secondary mb-4" />
          <h2 className="text-2xl font-semibold text-text-primary">{t('projects.noCalculations')}</h2>
          <p className="text-text-secondary mt-2 max-w-md">
            {t('projects.noCalculationsHint')}
          </p>
          <Link to="/calculators" className="mt-6">
            <Button variant="primary">
              {t('emptyStates.callToAction')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {savedItems.map(item => (
            <SavedCalculationCard 
                key={item.id} 
                item={item} 
                onDelete={() => handleDelete(item.id, item.description)}
                onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
      <DetailedCalculationSheetModal 
        item={detailedViewItem}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default ProjectsPage;