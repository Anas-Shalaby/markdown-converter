import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const ConversionToggle = ({ mode, onToggle, isMobile = false }) => {
  const { t } = useLanguage();

  const toggleClasses = isMobile 
    ? 'w-full flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg'
    : 'flex justify-center md:justify-start items-center gap-4 bg-white p-3 rounded-lg shadow-sm';

  return (
    <div className={toggleClasses}>
      <button
        onClick={onToggle}
        className={`${
          isMobile 
            ? 'p-3 bg-blue-500 text-white rounded-full' 
            : 'p-2 hover:bg-gray-100 rounded-full transition-colors'
        }`}
        aria-label="Toggle conversion mode"
      >
      
      </button>
      <span className={`font-medium ${mode === 'markdown' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {t('conversionToggle.markdown')}
      </span>
      {isMobile ? (
          <span className="text-sm">{t('conversionToggle.switch')}</span>
        ) : (
          <FaExchangeAlt className="text-gray-600" />
        )}
      <span className={`font-medium ${mode === 'text' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {t('conversionToggle.plainText')}
      </span>
    </div>
  );
};

export default ConversionToggle;