import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const Preview = ({ content, mode }) => {
  const createMarkup = () => {
    if (mode === 'markdown') {
      const rawMarkup = marked(content, { breaks: true });
      const cleanMarkup = DOMPurify.sanitize(rawMarkup);
      return { __html: cleanMarkup };
    }
    
    // For text mode, process the content line by line
    const processedContent = content.split('\n').map(line => {
      if (line.startsWith('[H1]')) {
        return `<h1>${line.substring(4)}</h1>`;
      }
      // Process bold and italic tags
      return line
        .replace(/\[B\](.*?)\[\/B\]/g, '<strong>$1</strong>')
        .replace(/\[I\](.*?)\[\/I\]/g, '<em>$1</em>');
    }).join('\n');
    
    return { __html: processedContent };
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-600">
          {mode === 'markdown' ? 'Preview' : 'Markdown Output'}
        </h2>
      </div>
      <div className="h-[calc(100%-40px)] overflow-auto p-6">
        <div 
          className={mode === 'markdown' ? 'prose max-w-none ' : 'whitespace-pre-wrap font-mono text-gray-700'}
          dangerouslySetInnerHTML={createMarkup()} 
        />
      </div>
    </div>
  );
};

export default Preview;