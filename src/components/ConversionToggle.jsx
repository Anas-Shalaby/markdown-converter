import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const ConversionToggle = ({ mode, onToggle }) => {
  return (
    <div className="flex justify-center md:justify-start items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
      <span className={`font-medium ${mode === 'markdown' ? 'text-blue-600' : 'text-gray-500'}`}>
        Markdown
      </span>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Toggle conversion mode"
      >
        <FaExchangeAlt className="text-gray-600" />
      </button>
      <span className={`font-medium ${mode === 'text' ? 'text-blue-600' : 'text-gray-500'}`}>
        Plain Text
      </span>
    </div>
  );
};

export default ConversionToggle;