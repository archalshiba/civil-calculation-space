
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ParameterTable from '../ui/ParameterTable';
import { getGlobalSettings } from '../../utils/settings';
import { getSchematicForType } from '../../utils/ui';
import { DocumentDownloadIcon } from '../icons/Icons';
import { useI18n } from '../../contexts/I18nContext';
import type { SavedCalculationItem, GlobalSettings } from '../../types';

interface DetailedCalculationSheetModalProps {
  item: SavedCalculationItem | null;
  onClose: () => void;
}

const DetailedCalculationSheetModal: React.FC<DetailedCalculationSheetModalProps> = ({ item, onClose }) => {
    const { t } = useI18n();
    const [settings, setSettings] = useState<GlobalSettings>(getGlobalSettings());
    
    useEffect(() => {
        if(item){
            setSettings(getGlobalSettings());
        }
    }, [item]);

    if (!item) {
        return null;
    }
    
    const Schematic = getSchematicForType(item.type);

    const handleExportPDF = () => {
        const input = document.getElementById('print-area-detailed');
        if (input) {
            html2canvas(input, { scale: 2, useCORS: true, backgroundColor: document.documentElement.classList.contains('light') ? '#f1f5f9' : '#0f172a' }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                let imgWidth = pdfWidth - 20; // margin
                let imgHeight = imgWidth / ratio;
                let heightLeft = imgHeight;
                let position = 10;
                
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= (pdf.internal.pageSize.getHeight() - 20);

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight + 10; // top margin
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= (pdf.internal.pageSize.getHeight() - 20);
                }

                pdf.save(`${item.type.replace(/[/ ]/g, '_')}_${item.id}.pdf`);
            });
        }
    };

    return (
        <Modal isOpen={!!item} onClose={onClose} title={t('reports.detailsSheetTitle')}>
             <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

                    /* Hide all non-essential UI */
                    header, aside, .print-hide, .flex.h-screen > .flex-shrink-0 { 
                        display: none !important; 
                    }
                    
                    /* Reset main layout for printing */
                    body, #root, .flex.h-screen, .flex-1, main {
                        display: block !important;
                        overflow: visible !important;
                        height: auto !important;
                        background: transparent !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    
                    /* Override modal styles to make it a printable document */
                    .fixed.inset-0.bg-black { /* Modal backdrop */
                        position: static !important;
                        background: transparent !important;
                        display: block !important;
                        padding: 0 !important;
                        justify-content: flex-start !important;
                        align-items: flex-start !important;
                    }
                    
                    .bg-surface.border.border-border.rounded-lg.shadow-xl { /* Modal container */
                        max-width: 100% !important;
                        width: 100% !important;
                        max-height: none !important;
                        box-shadow: none !important;
                        border: none !important;
                        animation: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                     .bg-surface.border.border-border.rounded-lg.shadow-xl > header, /* Hide modal header */
                     .bg-surface.border.border-border.rounded-lg.shadow-xl > .flex-grow.overflow-y-auto {
                        padding: 0 !important;
                     }


                    /* Theming for print */
                    #print-area-detailed { 
                        color: var(--color-text-primary);
                    }
                    #print-area-detailed .bg-dark, 
                    #print-area-detailed .bg-surface-secondary\\/30, 
                    #print-area-detailed .bg-surface\\/40, 
                    #print-area-detailed .bg-surface-secondary\\/50 {
                       background-color: var(--color-surface-secondary) !important;
                    }
                    #print-area-detailed .border-border, 
                    #print-area-detailed .border-border\\/50, 
                    #print-area-detailed .border-secondary\\/50 {
                       border-color: var(--color-border) !important;
                    }
                }
             `}</style>
            <div className="modal-content">
                <div className="flex justify-end space-x-4 mb-4 print-hide">
                    <Button onClick={() => window.print()}>{t('buttons.print')}</Button>
                    <Button variant="secondary" onClick={handleExportPDF} className="flex items-center space-x-2">
                        <DocumentDownloadIcon className="h-5 w-5" />
                        <span>{t('buttons.exportPDF')}</span>
                    </Button>
                </div>
                
                <div id="print-area-detailed" className="bg-surface p-6 rounded-lg border border-border">
                    <header className="mb-6 border-b border-border/50 pb-4">
                        <h1 className="text-2xl font-bold text-text-primary">{settings.projectName}</h1>
                        <p className="text-text-secondary">{settings.projectNumber}</p>
                    </header>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-accent">{item.type}</h2>
                        <p className="text-lg text-text-primary">{item.description}</p>
                        <p className="text-xs text-text-secondary/80 mt-1">
                            {t('projects.calculatedOn', { date: new Date(item.timestamp).toLocaleString() })}
                        </p>
                    </div>
                    
                    <div className="md:grid md:grid-cols-2 md:gap-x-8">
                        <ParameterTable title={t('reports.inputParameters')} data={item.inputs} />
                        
                        <div className="mt-6 md:mt-0">
                            <ParameterTable title={t('reports.calculationResults')} data={item.results} />
                            
                            {item.results.calculationTrace && item.results.calculationTrace.length > 0 && (
                                <div className="mt-6 break-inside-avoid">
                                    <h3 className="text-lg font-semibold text-primary mb-3">{t('reports.calculationSteps')}</h3>
                                    <div className="space-y-3">
                                        {item.results.calculationTrace.map((step, index) => (
                                            <div key={index} className="bg-surface-secondary/30 p-3 rounded-lg border border-border/50">
                                                <p className="font-semibold text-sm text-text-primary">{step.description}</p>
                                                <p className="font-mono text-xs text-accent mt-1">{step.formula}</p>
                                                <p className="font-mono text-xs text-text-secondary mt-1">{step.calculation}</p>
                                                <p className="font-mono text-xs text-text-primary font-bold mt-1">= {step.result}</p>
                                                {step.reference && <p className="text-xs text-text-secondary/70 mt-2">Ref: {step.reference}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {Schematic && (
                                <div className="mt-6 bg-surface-secondary/50 p-4 rounded-lg flex flex-col items-center justify-center break-inside-avoid">
                                    <h3 className="text-lg font-semibold text-primary mb-2">{t('common.schematic')}</h3>
                                    <Schematic />
                                </div>
                            )}
                        </div>
                    </div>

                    <footer className="mt-8 pt-4 border-t border-border/50 text-xs text-text-secondary">
                        <p>{t('reports.footerDisclaimer')}</p>
                        <p>{t('sidebar.copyright')}</p>
                    </footer>
                </div>
            </div>
        </Modal>
    );
};

export default DetailedCalculationSheetModal;