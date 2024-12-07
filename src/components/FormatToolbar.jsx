import React from 'react';
import { FaHeading, FaBold, FaItalic } from 'react-icons/fa';

const FormatToolbar = ({ onFormat }) => {
  const buttons = [
    { icon: <FaHeading />, format: 'h1', label: 'Heading 1' },
    { icon: <FaBold />, format: 'bold', label: 'Bold' },
    { icon: <FaItalic />, format: 'italic', label: 'Italic' }
  ];

  return (
    <div className="flex gap-2 p-2 bg-gray-50 border-b border-gray-200">
      {buttons.map(({ icon, format, label }) => (
        <button
          key={format}
          onClick={() => onFormat(format)}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
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