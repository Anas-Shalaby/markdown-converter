import React from 'react';

const MarkdownEditor = ({ value, onChange }) => {
  return (
    <div className="h-full">
      <textarea
        className="w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your markdown here..."
      />
    </div>
  );
};

export default MarkdownEditor;