import React, { useState } from 'react';
import { FaFilePdf, FaFileWord, FaDownload, FaFilePowerpoint } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import DOMPurify from 'dompurify';
import pptxgen from "pptxgenjs";
import { processTextEquations } from '../utils/mathUtils';
import 'katex/dist/katex.min.css';
import { useLanguage } from '../contexts/LanguageContext';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  typographer: true
}).use(mk);

const DownloadButton = ({ content, mode, className = '' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t, isDarkMode } = useLanguage();

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
    setIsDropdownOpen(false);
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
    
    setIsDropdownOpen(false);
  };

  const handlePptxDownload = async () => {
    try {
      const pres = new pptxgen();
      
      // Get the rendered content using markdown-it
      let renderedContent;
      if (mode === 'markdown') {
        renderedContent = md.render(content);
      } else {
        const processedContent = processTextEquations(content);
        renderedContent = md.render(processedContent);
      }
      renderedContent = DOMPurify.sanitize(renderedContent);

      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderedContent;
      
      // Split content based on headers or paragraphs
      const elements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, pre, code');
      let currentSlide = null;
      let currentContent = [];

      const addSlideContent = (slide, elements) => {
        let yPos = 1;  // Start lower on the slide
        let currentSlide = slide;
        
        elements.forEach(element => {
          const tagName = element.tagName.toLowerCase();
          
          if (tagName.match(/^h[1-6]$/)) {
            // Header styling
            const level = parseInt(tagName[1]);
            currentSlide.addText(element.textContent, {
              x: 1,
              y: yPos,
              w: '88%',  // Slightly reduced width
              fontSize: 36 - (level * 4), // h1: 32, h2: 28, h3: 24, etc.
              bold: true,
              color: '363636',
              align: 'left',
              fontFace: 'Arial',
              breakLine: true
            });
            yPos += 1.2;  // Increased vertical spacing for headers
          } else if (tagName === 'p') {
            // Paragraph styling
            currentSlide.addText(element.textContent, {
              x: 1,
              y: yPos,
              w: '88%',
              fontSize: 18,
              color: '363636',
              align: 'left',
              fontFace: 'Arial',
              breakLine: true,
              h: "auto"
            });
            yPos += 0.8;  // Increased vertical spacing
          } else if (tagName === 'pre' || tagName === 'code') {
            // Code block styling
            currentSlide.addText(element.textContent, {
              x: 1,
              y: yPos,
              w: '88%',
              fontSize: 16,
              fontFace: 'Courier New',
              color: '363636',
              fill: { color: 'F0F0F0' },
              align: 'left',
              breakLine: true,
              h: "auto"
            });
            yPos += 1.2;  // Increased vertical spacing
          } else if (tagName === 'ul' || tagName === 'ol') {
            // List styling
            const items = Array.from(element.children).map(li => li.textContent);
            currentSlide.addText(items.map(item => `• ${item}`).join('\n'), {
              x: 1.2, // Slightly indented
              y: yPos,
              w: '85%',
              fontSize: 18,
              color: '363636',
              align: 'left',
              fontFace: 'Arial',
              breakLine: true,
              bullet: { type: tagName === 'ol' ? 'number' : 'bullet' }
            });
            yPos += 0.6 * items.length;  // Adjusted based on number of items
          } else if (tagName === 'blockquote') {
            // Blockquote styling
            currentSlide.addText(element.textContent, {
              x: 1.2,
              y: yPos,
              w: '85%',
              fontSize: 18,
              color: '666666',
              italic: true,
              align: 'left',
              fontFace: 'Arial',
              breakLine: true
            });
            yPos += 0.8;
          }

          // If content exceeds slide height, create new slide
          if (yPos > 7) {
            yPos = 1.5;
            currentSlide = pres.addSlide();
            currentSlide.background = { color: "FFFFFF" };
          }
        });
      };

      // Process elements and create slides
      let currentElements = [];
      elements.forEach((element) => {
        // Start new slide for headers
        if (element.tagName.match(/^H[1-3]$/) && currentElements.length > 0) {
          currentSlide = pres.addSlide();
          currentSlide.background = { color: "FFFFFF" };
          addSlideContent(currentSlide, currentElements);
          currentElements = [];
        }
        currentElements.push(element);
      });

      // Add remaining content as the last slide
      if (currentElements.length > 0) {
        currentSlide = pres.addSlide();
        currentSlide.background = { color: "FFFFFF" };
        addSlideContent(currentSlide, currentElements);
      }

      // Save the presentation
      await pres.writeFile({ fileName: 'presentation.pptx' });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error creating PowerPoint:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors ${className}`}
      >
        <FaDownload />
        <span>{t('buttons.download')}</span>
      </button>

      {isDropdownOpen && (
        <div className={`absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg 
          ${mode === 'markdown' ? 'bg-white' : 'bg-gray-100'} 
          ring-1 ring-black ring-opacity-5 focus:outline-none`}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={handlePdfDownload}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <FaFilePdf className="mr-2" /> {t('buttons.pdf')}
            </button>
            <button
              onClick={handleWordDownload}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <FaFileWord className="mr-2" /> {t('buttons.word')}
            </button>
            <button
              onClick={handlePptxDownload}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <FaFilePowerpoint className="mr-2" /> {t('buttons.powerpoint')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
