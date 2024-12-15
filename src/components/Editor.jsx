import React, { useState, useRef, useEffect } from 'react';
import FormatToolbar from './FormatToolbar';
import { 
  FaBold, 
  FaItalic, 
  FaHeading, 
  FaListUl, 
  FaListOl, 
  FaQuoteRight, 
  FaCode,
  FaStrikethrough,
  FaLink,
  FaUnderline
} from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const Editor = ({ 
  content, 
  setContent, 
  mode, 
  isDarkMode, 
  isRTL,
  className = '' 
}) => {
  const { t } = useLanguage();
  const textareaRef = useRef(null);

  const placeholder = mode === 'markdown'
    ? t('placeholders.markdownEditor')
    : t('placeholders.plainTextEditor');

  const applyFormat = (command) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = selectedText;
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        break;
      case 'unorderedList':
        formattedText = `- ${selectedText}`;
        break;
      case 'orderedList':
        formattedText = `1. ${selectedText}`;
        break;
      case 'blockquote':
        formattedText = `> ${selectedText}`;
        break;
      case 'code':
        formattedText = selectedText.includes('\n') 
          ? `\`\`\`\n${selectedText}\n\`\`\`` 
          : `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        return;
    }

    const newContent = 
      content.substring(0, start) + 
      formattedText + 
      content.substring(end);

    setContent(newContent);

    // Set cursor position after the formatted text
    setTimeout(() => {
      textarea.selectionStart = start + formattedText.length;
      textarea.selectionEnd = start + formattedText.length;
      textarea.focus();
    }, 0);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className={`editor-container flex flex-col h-full ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-md ${className}`}>
      <div className={`px-4 py-2 border-b flex justify-between items-center ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600 text-gray-300' 
          : 'bg-gray-100 border-gray-200'
      }`}>
        <h2 className="text-sm font-medium">
          {mode === 'markdown' ? 'Markdown Editor' : 'Text Editor'}
        </h2>
        {mode === 'markdown' && (
          <FormatToolbar 
            onFormat={applyFormat} 
            isDarkMode={isDarkMode} 
          />
        )}
      </div>

      <div className="flex-grow overflow-auto">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className={`w-full h-full p-4 resize-none outline-none text-base ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-200 placeholder-gray-500' 
              : 'bg-white text-gray-800 placeholder-gray-400'
          }`}
          style={{ 
            direction: isRTL ? 'rtl' : 'ltr', 
            textAlign: isRTL ? 'right' : 'left',
            fontSize: '16px',
            lineHeight: '1.5'
          }}
        />
      </div>
    </div>
  );
};

export default Editor;