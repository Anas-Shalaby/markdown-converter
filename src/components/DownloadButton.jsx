import React, { useState } from 'react';
import { FaFilePdf, FaFileWord, FaDownload } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
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

const DownloadButton = ({ content, mode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getFormattedContent = () => {
    const element = document.createElement('div');
    element.className = 'prose max-w-none';
    
    if (mode === 'markdown') {
      const renderedContent = md.render(content);
      element.innerHTML = renderedContent;
    } else {
      // Process text equations before rendering
      const processedContent = processTextEquations(content);
      const renderedContent = md.render(processedContent);
      element.innerHTML = renderedContent;
    }
    return element;
  };

  const handlePdfDownload = () => {
    const element = getFormattedContent();
    const opt = {
      margin: [0.5, 0.5],
      filename: `document-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait'
      }
    };
    html2pdf().set(opt).from(element).save();
    setIsOpen(false);
  };

  const handleWordDownload = () => {
    let processedContent;
    if (mode === 'markdown') {
      processedContent = md.render(content);
    } else {
      // Process text equations before rendering
      const textWithEquations = processTextEquations(content);
      processedContent = md.render(textWithEquations);
    }
    
    const cleanHtml = DOMPurify.sanitize(processedContent);
    
    // Basic Word HTML template with KaTeX styles
    const wordTemplate = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Export HTML to Word Document with JavaScript</title>
        <style>
          body { 
            font-family: 'Calibri', sans-serif;
            white-space: pre-wrap;
          }
          pre { 
            white-space: pre-wrap;
            font-family: 'Calibri', sans-serif;
          }
          .katex { 
            font-family: KaTeX_Math, Times New Roman, serif;
            font-size: 1.1em;
          }
          .katex-display {
            display: block;
            margin: 1em 0;
            text-align: center;
          }
          .katex-inline {
            display: inline;
            margin: 0 0.2em;
          }
        </style>
      </head>
      <body>
        ${cleanHtml}
      </body>
      </html>
    `;

    const blob = new Blob([wordTemplate], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-${Date.now()}.doc`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        title="Download"
      >
        <FaDownload />
        <span>Download</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
          <button
            onClick={handlePdfDownload}
            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 transition-colors"
          >
            <FaFilePdf className="text-red-500" />
            <span>Download as PDF</span>
          </button>
          <button
            onClick={handleWordDownload}
            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 transition-colors"
          >
            <FaFileWord className="text-blue-500" />
            <span>Download as Word</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
