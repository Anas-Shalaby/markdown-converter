import React, { useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MarkdownPreview = ({ markdown }) => {
  useEffect(() => {
    // Configure marked renderer for math
    const renderer = new marked.Renderer();
    const originalParagraph = renderer.paragraph.bind(renderer);

    renderer.paragraph = (text) => {
      // Handle display math equations
      if (text.startsWith('$$') && text.endsWith('$$')) {
        try {
          const math = text.slice(2, -2);
          const rendered = katex.renderToString(math, { displayMode: true });
          return `<div class="math math-display">${rendered}</div>`;
        } catch (err) {
          console.error('KaTeX error:', err);
          return `<div class="math math-display-error">${text}</div>`;
        }
      }
      return originalParagraph(text);
    };

    // Configure marked options
    marked.setOptions({
      renderer,
      gfm: true,
      breaks: true,
      tables: true,
      pedantic: false,
      smartLists: true,
      xhtml: true,
      walkTokens: (token) => {
        if (token.type === 'text') {
          // Handle inline math equations
          token.text = token.text.replace(/\$([^$]+)\$/g, (match, math) => {
            try {
              return katex.renderToString(math, { displayMode: false });
            } catch (err) {
              console.error('KaTeX error:', err);
              return match;
            }
          });
        }
      }
    });
  }, []);

  const createMarkup = () => {
    try {
      const rawMarkup = marked(markdown || '');
      const cleanMarkup = DOMPurify.sanitize(rawMarkup, {
        ADD_TAGS: ['math'],
        ADD_ATTR: ['class']
      });
      return { __html: cleanMarkup };
    } catch (err) {
      console.error('Markdown processing error:', err);
      return { __html: markdown || '' };
    }
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