import React from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useLanguage } from '../contexts/LanguageContext';

const Preview = ({ 
  content, 
  mode, 
  isDarkMode, 
  isRTL, 
  className = '' 
}) => {
  const { t } = useLanguage();

  // Sanitize and convert markdown to HTML
  const createMarkup = () => {
    if (!content) return { __html: '' };
    
    const rawMarkup = mode === 'markdown' 
      ? marked.parse(content)
      : content.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/\n/g, '<br>');
    
    return { 
      __html: DOMPurify.sanitize(rawMarkup) 
    };
  };

  return (
    <div className={`preview-container flex flex-col h-full ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-md ${className}`}>
      <div className={`px-4 py-2 border-b flex items-center ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600 text-gray-300' 
          : 'bg-gray-100 border-gray-200'
      }`}>
        <h2 className="text-sm font-medium">
          {mode === 'markdown' ? 'Markdown Preview' : 'Text Preview'}
        </h2>
      </div>

      <div 
        className={`flex-grow overflow-auto p-4 ${
          isDarkMode 
            ? 'bg-gray-800 text-gray-200' 
            : 'bg-white text-gray-800'
        }`}
      >
        {mode === 'markdown' ? (
          <div 
            className={`prose prose-base max-w-none ${
              isDarkMode 
                ? 'prose-invert' 
                : ''
            }`}
            style={{
              color: isDarkMode ? 'white' : 'inherit',
              backgroundColor: isDarkMode ? 'rgb(31 41 55)' : 'transparent'
            }}
            dangerouslySetInnerHTML={createMarkup()}
          />
        ) : (
          <pre className={`whitespace-pre-wrap break-words text-base ${
            isDarkMode 
              ? 'text-gray-200 bg-gray-800' 
              : 'text-gray-800 bg-white'
          }`}>{content}</pre>
        )}
      </div>
    </div>
  );
};

export default Preview;