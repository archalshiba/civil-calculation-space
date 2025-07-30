import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useI18n } from '../../contexts/I18nContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ProjectVisualizationsProps {
  concreteData: { [key: string]: number };
  steelData: { [key: string]: number };
}

const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#14b8a6', // teal-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

const LIGHT_TEXT_COLOR = '#f1f5f9';
const GRID_COLOR = 'rgba(241, 245, 249, 0.1)';

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: LIGHT_TEXT_COLOR,
        font: {
          size: 12,
        }
      }
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: LIGHT_TEXT_COLOR,
      bodyColor: LIGHT_TEXT_COLOR,
      borderColor: '#334155',
      borderWidth: 1,
    }
  },
};

const ProjectVisualizations: React.FC<ProjectVisualizationsProps> = ({ concreteData, steelData }) => {
  const { t } = useI18n();
  const pieData = {
    labels: Object.keys(concreteData),
    datasets: [
      {
        label: t('charts.concreteVolumeLabel'),
        data: Object.values(concreteData),
        backgroundColor: CHART_COLORS,
        borderColor: '#0f172a',
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: Object.keys(steelData).sort(),
    datasets: [
      {
        label: t('charts.steelWeightLabel'),
        data: Object.keys(steelData).sort().map(key => steelData[key]),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: GRID_COLOR },
        ticks: { color: LIGHT_TEXT_COLOR },
      },
      x: {
        grid: { color: 'transparent' },
        ticks: { color: LIGHT_TEXT_COLOR },
      },
    },
  };

  return (
    <div className="bg-secondary/30 p-6 rounded-lg chart-container">
      <h2 className="text-2xl font-semibold text-light mb-6">{t('charts.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark/50 p-4 rounded-lg border border-secondary">
          <h3 className="text-lg font-semibold text-center text-light mb-4">{t('charts.concreteTitle')}</h3>
          <div className="relative h-80">
            <Pie data={pieData} options={commonOptions} />
          </div>
        </div>
        <div className="bg-dark/50 p-4 rounded-lg border border-secondary">
          <h3 className="text-lg font-semibold text-center text-light mb-4">{t('charts.steelTitle')}</h3>
          <div className="relative h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectVisualizations;