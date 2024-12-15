import React from 'react';
import { 
  FaHeading, 
  FaBold, 
  FaItalic, 
  FaListUl, 
  FaListOl, 
  FaQuoteRight, 
  FaCode,
  FaStrikethrough,
  FaLink,
  FaUnderline
} from 'react-icons/fa';

const FormatToolbar = ({ onFormat, isDarkMode = false }) => {
  const buttons = [
    { icon: <FaHeading />, format: 'heading', label: 'H' },
    { icon: <FaBold />, format: 'bold', label: 'B' },
    { icon: <FaItalic />, format: 'italic', label: 'I' },
    { icon: <FaUnderline />, format: 'underline', label: 'U' },
    { icon: <FaStrikethrough />, format: 'strikethrough', label: 'S' },
    { icon: <FaListUl />, format: 'unorderedList', label: 'UL' },
    { icon: <FaListOl />, format: 'orderedList', label: 'OL' },
    { icon: <FaQuoteRight />, format: 'blockquote', label: 'Q' },
    { icon: <FaCode />, format: 'code', label: 'C' },
    { icon: <FaLink />, format: 'link', label: 'L' }
  ];

  return (
    <div 
      className={`flex flex-wrap items-center space-x-1 p-1 ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600' 
          : 'bg-gray-50 border-gray-200'
      } border-b`}
    >
      {buttons.map(({ icon, format, label }) => (
        <button
          key={format}
          onClick={() => onFormat(format)}
          className={`
            p-1 rounded transition-colors 
            flex flex-col items-center justify-center 
            w-8 h-8 text-xs
            ${isDarkMode 
              ? 'hover:bg-gray-600 text-gray-300' 
              : 'hover:bg-gray-200 text-gray-700'
            }
          `}
          title={label}
          aria-label={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default FormatToolbar;