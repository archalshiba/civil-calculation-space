import React from 'react';
import { formatInputKey } from '../../utils/ui';
import { useI18n } from '../../contexts/I18nContext';

interface ParameterTableProps {
  title: string;
  data: object;
}

const ParameterTable: React.FC<ParameterTableProps> = ({ title, data }) => {
    const { t } = useI18n();

    return (
        <div className="break-inside-avoid">
            <h3 className="text-lg font-semibold text-primary mb-3 mt-4">{title}</h3>
            <table className="w-full text-left text-sm">
                <tbody>
                    {Object.entries(data)
                        .filter(([, value]) => value !== undefined && value !== null && value !== '' && value !== 'None' && typeof value !== 'object')
                        .map(([key, value]) => (
                        <tr key={key} className="border-b border-border/50">
                            <td className="py-2 pr-4 text-text-secondary">{t(`resultsKeys.${key}`, { defaultValue: formatInputKey(key) })}</td>
                            <td className="py-2 font-medium text-text-primary">{String(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ParameterTable;
