import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const CopyButton = ({ text, mode, className = '' }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { t, isDarkMode } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 
      ${isDarkMode 
        ? 'bg-green-700 text-white hover:bg-green-600' 
        : 'bg-green-500 text-white hover:bg-green-600'
      } ${className}`}
    >
      {isCopied ? (
        <>
          <FaCheck className="mr-2" />
          {t('buttons.copied')}
        </>
      ) : (
        <>
          <FaCopy className="mr-2" />
          {t('buttons.copy')}
        </>
      )}
    </button>
  );
};

export default CopyButton;