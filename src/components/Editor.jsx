import React, { useRef, useState, useEffect } from 'react';
import FormatToolbar from './FormatToolbar';
import { useLanguage } from '../contexts/LanguageContext';

const Editor = ({ 
  value, 
  onChange, 
  mode, 
  isDarkMode, 
  isRTL 
}) => {
  const textareaRef = useRef(null);
  const [content, setContent] = useState(value);
  const { t } = useLanguage();

  const placeholder = mode === 'markdown' 
    ? t('placeholders.markdownEditor')
    : t('placeholders.plainTextEditor');

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // Find the start and end of the current line
    let lineStart = text.lastIndexOf('\n', start - 1) + 1;
    if (lineStart === -1) lineStart = 0;
    let lineEnd = text.indexOf('\n', start);
    if (lineEnd === -1) lineEnd = text.length;
    
    let newText = text;
    const currentLine = text.substring(lineStart, lineEnd);

    switch (format) {
      case 'h1':
        if (mode === 'text') {
          const hasH1 = currentLine.startsWith('[H1]');
          newText = text.substring(0, lineStart) +
                   (hasH1 ? currentLine.substring(4) : '[H1]' + currentLine) +
                   text.substring(lineEnd);
        }
        break;
      case 'bold':
        if (mode === 'text' && start !== end) {
          const selectedText = text.substring(start, end);
          newText = text.substring(0, start) +
                   '[B]' + selectedText + '[/B]' +
                   text.substring(end);
        }
        break;
      case 'italic':
        if (mode === 'text' && start !== end) {
          const selectedText = text.substring(start, end);
          newText = text.substring(0, start) +
                   '[I]' + selectedText + '[/I]' +
                   text.substring(end);
        }
        break;
    }

    setContent(newText);
    onChange(newText);
    
    // Restore focus to textarea
    textarea.focus();
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  return (
    <div className={`h-full rounded-lg shadow-lg overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white'
    }`}>
      <div className={`px-4 py-2 border-b ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600 text-gray-300' 
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <h2 className="text-sm font-medium">
          {mode === 'markdown' ? 'Markdown Editor' : 'Text Editor'}
        </h2>
      </div>
      {mode === 'text' && <FormatToolbar onFormat={handleFormat} />}
      <textarea
        ref={textareaRef}
        className={`w-full h-[calc(100%-40px)] p-4 focus:outline-none focus:ring-0 resize-none font-mono transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 text-gray-100 placeholder-gray-500' 
            : 'text-gray-700 placeholder-gray-500'
        }`}
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left'
        }}
      />
    </div>
  );
};

export default Editor;