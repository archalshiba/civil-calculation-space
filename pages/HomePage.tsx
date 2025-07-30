import React from 'react';
import { Link } from 'react-router-dom';
import { CalculatorIcon, FolderIcon, DocumentReportIcon } from '../components/icons/Icons';
import { useI18n } from '../contexts/I18nContext';

const FeatureCard = ({ icon, title, description, linkTo }: { icon: React.ReactNode, title: string, description: string, linkTo: string }) => {
  const { t } = useI18n();
  return (
    <Link to={linkTo} className="bg-surface border border-border rounded-lg p-6 hover:border-accent hover:shadow-lg transition-all duration-300 flex flex-col items-start">
      <div className="bg-primary p-3 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary flex-grow">{description}</p>
      <span className="mt-4 text-accent font-semibold hover:underline">{t('buttons.goTo', { feature: title })} &rarr;</span>
    </Link>
  );
};


const HomePage: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold text-text-primary mb-4">{t('home.title')}</h1>
      <p className="text-lg text-text-secondary mb-12">
        {t('home.description')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<CalculatorIcon className="h-8 w-8 text-white" />}
          title={t('home.features.calculators.title')}
          description={t('home.features.calculators.description')}
          linkTo="/calculators"
        />
        <FeatureCard 
          icon={<FolderIcon className="h-8 w-8 text-white" />}
          title={t('home.features.projects.title')}
          description={t('home.features.projects.description')}
          linkTo="/projects"
        />
        <FeatureCard 
          icon={<DocumentReportIcon className="h-8 w-8 text-white" />}
          title={t('home.features.reports.title')}
          description={t('home.features.reports.description')}
          linkTo="/reports"
        />
      </div>
    </div>
  );
};

export default HomePage;