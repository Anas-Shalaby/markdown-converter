import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import DOMPurify from 'dompurify';
import { processTextEquations } from '../utils/mathUtils';
import 'katex/dist/katex.min.css';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  typographer: true
}).use(mk);

const Preview = ({ 
  content, 
  mode, 
  onChange, 
  isDarkMode,
  isRTL 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const createMarkup = () => {
    if (mode === 'markdown') {
      const renderedContent = md.render(content);
      const cleanContent = DOMPurify.sanitize(renderedContent);
      return { __html: cleanContent };
    } else {
      // Process text equations before rendering
      const processedContent = processTextEquations(content);
      // Use markdown-it to render the equations
      const renderedContent = md.render(processedContent);
      const cleanContent = DOMPurify.sanitize(renderedContent);
      return { __html: cleanContent };
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    setIsEditing(false);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div 
      className={`h-full overflow-auto rounded-lg p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 text-gray-200 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}
      style={{
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      <div 
        className={`prose max-w-none 
        prose-headings:font-bold
        prose-h1:text-3xl
        prose-h2:text-2xl
        prose-h3:text-xl
        prose-p:my-4
        prose-a:text-blue-600
        prose-a:no-underline
        prose-a:hover:text-blue-800
        prose-blockquote:border-l-4
        prose-blockquote:border-gray-300
        prose-blockquote:pl-4
        prose-blockquote:italic
        prose-table:w-full 
        prose-table:border-collapse 
        prose-td:border 
        prose-td:border-gray-200 
        prose-td:p-3
        prose-th:border 
        prose-th:border-gray-200 
        prose-th:bg-gray-50 
        prose-th:p-3
        prose-thead:border-b-2
        prose-thead:border-gray-200
        prose-tr:border-b
        prose-tr:border-gray-200
        prose-tr:last:border-b-0
        whitespace-pre-wrap
        ${isDarkMode 
          ? 'prose-invert prose-a:text-blue-400 prose-a:hover:text-blue-300 text-gray-100' 
          : 'text-gray-800'
        }`}
        dangerouslySetInnerHTML={createMarkup()} 
      />
    </div>
  );
};

export default Preview;