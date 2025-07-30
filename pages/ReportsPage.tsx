

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getSavedCalculations } from '../utils/storage';
import { getGlobalSettings } from '../utils/settings';
import { exportScheduleToDxf } from '../utils/dxfExporter';
import { FolderOpenIcon, DocumentDownloadIcon, CubeTransparentIcon } from '../components/icons/Icons';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import BarShapeSVG from '../components/ui/BarShapeSVG';
import type { ScheduleItem, ReinforcementBar } from '../types';
import ProjectVisualizations from '../components/reports/ProjectVisualizations';
import { getCategoryForType } from '../utils/ui';
import { useI18n } from '../contexts/I18nContext';

// Helper to parse "123.45 kg" into 123.45
const parseValue = (value?: string): number => {
  if (!value) return 0;
  return parseFloat(value) || 0;
};

const SummaryCard = ({ title, value, unit }: { title: string, value: string, unit: string }) => (
    <div className="bg-surface p-6 rounded-lg border border-border">
        <h3 className="text-text-secondary text-md">{title}</h3>
        <p className="text-3xl font-bold text-text-primary mt-1">
            {value} <span className="text-xl font-semibold text-text-secondary">{unit}</span>
        </p>
    </div>
);

const MaterialSummaryTables = ({ reportData, t }: { reportData: any, t: (key: string) => string }) => (
     <div className="space-y-8">
        <div className="bg-surface/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">{t('reports.projectTotals')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard title={t('reports.totalConcreteVolume')} value={reportData.totalConcreteVolume.toFixed(2)} unit="m³" />
                <SummaryCard title={t('reports.totalFormworkArea')} value={reportData.totalFormworkArea.toFixed(2)} unit="m²" />
                <SummaryCard title={t('reports.totalSteelWeight')} value={reportData.totalSteelWeight.toFixed(2)} unit="kg" />
            </div>
        </div>
        <div className="bg-surface/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">{t('reports.steelByBarSize')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-primary/50">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-text-secondary">{t('reports.headers.barSize')}</th>
                            <th className="p-3 text-sm font-semibold text-text-secondary text-right">{t('reports.headers.totalWeightKg')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(reportData.steelByBarSize).sort().map(([barSize, weight]) => (
                            <tr key={barSize} className="border-b border-border/50">
                                <td className="p-3 text-text-primary font-medium">{barSize}</td>
                                <td className="p-3 text-text-primary text-right">{(weight as number).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const ReinforcementSchedule = ({ schedule, t }: { schedule: ScheduleItem[], t: (key: string) => string }) => (
    <div className="bg-surface/50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">{t('reports.reinforcementSchedule')}</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-primary/50">
                    <tr>
                        <th className="p-3 text-sm font-semibold text-text-secondary">{t('reports.headers.mark')}</th>
                        <th className="p-3 text-sm font-semibold text-text-secondary">{t('reports.headers.size')}</th>
                        <th className="p-3 text-sm font-semibold text-text-secondary">{t('reports.headers.shape')}</th>
                        <th className="p-3 text-sm font-semibold text-text-secondary text-right">{t('reports.headers.quantity')}</th>
                        <th className="p-3 text-sm font-semibold text-text-secondary text-right">{t('reports.headers.lengthM')}</th>
                        <th className="p-3 text-sm font-semibold text-text-secondary text-right">{t('reports.headers.totalLengthM')}</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((item) => (
                        <tr key={item.barMark} className="border-b border-border/50">
                            <td className="p-3 text-text-primary font-bold">{item.barMark}</td>
                            <td className="p-3 text-text-primary font-medium">{item.barSize}</td>
                            <td className="p-3"><BarShapeSVG shapeCode={item.shapeCode} /></td>
                            <td className="p-3 text-text-primary text-right">{item.quantity}</td>
                            <td className="p-3 text-text-primary text-right">{item.length.toFixed(3)}</td>
                            <td className="p-3 text-text-primary text-right">{item.totalLength.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ReportsPage: React.FC = () => {
    const { t } = useI18n();
    const savedItems = getSavedCalculations();
    const settings = getGlobalSettings();

    const { summaryData, scheduleData, concreteByCategory } = useMemo(() => {
        let totalConcreteVolume = 0;
        let totalFormworkArea = 0;
        let totalSteelWeight = 0;
        const steelByBarSize: { [key: string]: number } = {};
        const concreteByCategory: { [key: string]: number } = {};
        const scheduleMap = new Map<string, { barSize: string; shapeCode: ReinforcementBar['shapeCode']; length: number; quantity: number }>();

        const addToBarSize = (barSize: string | undefined, weight: number) => {
            if (barSize && weight > 0) {
                steelByBarSize[barSize] = (steelByBarSize[barSize] || 0) + weight;
            }
        };

        savedItems.forEach(item => {
            const volume = parseValue(item.results.concreteVolume);
            totalConcreteVolume += volume;
            totalFormworkArea += parseValue(item.results.formworkArea);
            totalSteelWeight += parseValue(item.results.totalSteelWeight);

            // Data for charts
            const category = getCategoryForType(item.type);
            if (category && volume > 0) {
              concreteByCategory[category] = (concreteByCategory[category] || 0) + volume;
            }

            // Steel summary for the tables
            addToBarSize(item.inputs.longitudinalBarSize, parseValue(item.results.longitudinalSteelWeight));
            addToBarSize(item.inputs.transverseBarSize, parseValue(item.results.transverseSteelWeight));
            addToBarSize(item.inputs.topBarSize, parseValue(item.results.topSteelWeight));
            addToBarSize(item.inputs.bottomBarSize, parseValue(item.results.bottomSteelWeight));
            addToBarSize(item.inputs.transverseBarSize, parseValue(item.results.stirrupSteelWeight));
            addToBarSize(item.inputs.footingTopBarSize, parseValue(item.results.topReinforcementWeight));
            addToBarSize(item.inputs.footingBottomBarSize, parseValue(item.results.bottomReinforcementWeight));
            addToBarSize(item.inputs.dowelBarSize, parseValue(item.results.dowelWeight));
            addToBarSize(item.inputs.verticalBarSize, parseValue(item.results.verticalSteelWeight));
            addToBarSize(item.inputs.horizontalBarSize, parseValue(item.results.horizontalSteelWeight));
            
            // Reinforcement schedule processing for the second tab
            item.results.detailedReinforcement?.forEach(bar => {
                const key = `${bar.barSize}|${bar.length.toFixed(3)}|${bar.shapeCode}`;
                const existing = scheduleMap.get(key);
                if (existing) {
                    existing.quantity += bar.count;
                } else {
                    scheduleMap.set(key, {
                        barSize: bar.barSize,
                        length: bar.length,
                        shapeCode: bar.shapeCode,
                        quantity: bar.count
                    });
                }
            });
        });

        let barMarkCounter = 1;
        const finalSchedule: ScheduleItem[] = Array.from(scheduleMap.values()).map(item => ({
            ...item,
            barMark: `T${barMarkCounter++}`,
            totalLength: item.quantity * item.length
        }));

        return {
            summaryData: { totalConcreteVolume, totalFormworkArea, totalSteelWeight, steelByBarSize, hasData: savedItems.length > 0 },
            scheduleData: finalSchedule,
            concreteByCategory
        };
    }, [savedItems, t]);

    const handlePrint = () => window.print();

    const handleExportPDF = () => {
        const input = document.getElementById('print-area');
        if (input) {
            html2canvas(input, { scale: 2, backgroundColor: '#0f172a' }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const ratio = canvas.width / canvas.height;
                const imgWidth = pdfWidth - 20; // margin
                const imgHeight = imgWidth / ratio;
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight > pdfHeight - 20 ? pdfHeight - 20 : imgHeight);
                pdf.save('CivilCalc_Report.pdf');
            });
        }
    };
    
    const handleExportDXF = () => {
        exportScheduleToDxf(scheduleData, settings.projectName, t);
    };

    if (savedItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center mt-16 bg-surface/50 border-2 border-dashed border-border rounded-lg py-16 px-6">
              <FolderOpenIcon className="h-16 w-16 text-text-secondary mb-4" />
              <h2 className="text-2xl font-semibold text-text-primary">{t('reports.noDataTitle')}</h2>
              <p className="text-text-secondary mt-2 max-w-md">
                {t('reports.noDataSubtitle')}
              </p>
              <Link to="/calculators" className="mt-6">
                <Button variant="primary">
                  {t('emptyStates.callToAction')}
                </Button>
              </Link>
            </div>
        );
    }
    
    const tabs = [
        { label: t('tabs.materialSummary'), content: (
            <div className="space-y-8">
                <ProjectVisualizations concreteData={concreteByCategory} steelData={summaryData.steelByBarSize} />
                <MaterialSummaryTables reportData={summaryData} t={t} />
            </div>
        ) },
        { label: t('tabs.reinforcementSchedule'), content: <ReinforcementSchedule schedule={scheduleData} t={t} /> }
    ];

    return (
        <>
            <style>{`
                @media print {
                    body { background-color: white !important; }
                    header, aside, .no-print { display: none !important; }
                    main { padding: 0 !important; }
                    #print-area {
                        color: black;
                        padding: 1rem;
                    }
                    #print-area .bg-dark\\/50, #print-area .bg-surface\\/50, #print-area .bg-surface-secondary\\/30, #print-area .border-secondary, #print-area .border-primary\\/50, #print-area .border-secondary\\/50, #print-area .border-border\\/50 {
                        background-color: white !important;
                        border-color: #e5e7eb !important;
                        box-shadow: none !important;
                    }
                    #print-area .text-light, #print-area .text-text-primary, #print-area .text-text-secondary, #print-area .text-gray-300, #print-area .text-gray-400, #print-area h1, #print-area h2, #print-area h3, #print-area p, #print-area th, #print-area td { color: black !important; }
                    #print-area .text-accent { color: #2563eb !important; }
                    #print-area svg { stroke: black !important; fill: black !important;}
                    #print-area .chart-container { page-break-inside: avoid; }
                }
            `}</style>
            <div>
                 <div className="flex flex-wrap justify-between items-center mb-8 gap-4 no-print">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">{t('reports.pageTitle')}</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button onClick={handlePrint}>{t('buttons.print')}</Button>
                        <Button variant="secondary" onClick={handleExportPDF} className="flex items-center space-x-2">
                            <DocumentDownloadIcon className="h-5 w-5" />
                            <span>{t('buttons.exportPDF')}</span>
                        </Button>
                        <Button variant="secondary" onClick={handleExportDXF} className="flex items-center space-x-2">
                            <CubeTransparentIcon className="h-5 w-5" />
                            <span>{t('buttons.exportDXF')}</span>
                        </Button>
                    </div>
                </div>
                <div className="animate-fade-in" id="print-area">
                    <Tabs tabs={tabs} />
                </div>
            </div>
        </>
    );
};

export default ReportsPage;