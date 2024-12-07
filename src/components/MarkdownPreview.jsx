import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const MarkdownPreview = ({ markdown }) => {
  const createMarkup = () => {
    // Configure marked options for better table handling
    marked.setOptions({
      gfm: true,
      breaks: true,
      tables: true,
      pedantic: false,
      smartLists: true,
      xhtml: true
    });

    const rawMarkup = marked(markdown);
    const cleanMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: cleanMarkup };
  };

  return (
    <div className="h-full overflow-auto bg-white border border-gray-200 rounded-lg p-4">
      <div 
        className="prose max-w-none
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
          prose-tr:last:border-b-0"
        dangerouslySetInnerHTML={createMarkup()} 
      />
    </div>
  );
};

export default MarkdownPreview;