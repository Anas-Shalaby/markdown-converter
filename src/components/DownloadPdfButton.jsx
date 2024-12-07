import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const DownloadPdfButton = ({ content, mode }) => {
  const handleDownload = () => {
    // Create a temporary container for the content
    const element = document.createElement('div');
    element.className = 'prose max-w-none pdf-content';
    
    // Create a wrapper for proper page sizing
    const wrapper = document.createElement('div');
    wrapper.style.width = '8.5in';
    wrapper.style.margin = '0 auto';
    wrapper.style.backgroundColor = 'white';
    wrapper.appendChild(element);
    
    if (mode === 'markdown') {
      // If it's markdown, use the existing preview container
      const previewContent = document.querySelector('.prose');
      if (previewContent) {
        element.innerHTML = previewContent.innerHTML;
      }
    } else {
      // If it's plain text, format it with pre tag
      const preElement = document.createElement('pre');
      preElement.style.whiteSpace = 'pre-wrap';
      preElement.style.wordBreak = 'break-word';
      preElement.style.fontFamily = 'monospace';
      preElement.style.margin = '0';
      preElement.style.padding = '1em';
      preElement.textContent = content;
      element.appendChild(preElement);
    }

    // Add custom styles for PDF generation
    const style = document.createElement('style');
    style.textContent = `
      .pdf-content {
        font-size: 12pt;
        line-height: 1.5;
        word-wrap: break-word;
        overflow-wrap: break-word;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        padding: 0.75in;
      }
      .pdf-content pre {
        white-space: pre-wrap !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        page-break-inside: avoid;
        margin: 1em 0;
        padding: 1em;
        background-color: #f5f5f5;
        border-radius: 4px;
        font-size: 11pt;
      }
      .pdf-content p {
        margin: 0.5em 0;
        page-break-inside: avoid;
      }
      .pdf-content h1, 
      .pdf-content h2, 
      .pdf-content h3 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }
      .pdf-content table {
        page-break-inside: avoid;
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
      }
      .pdf-content td,
      .pdf-content th {
        padding: 8px;
        border: 1px solid #ddd;
        word-wrap: break-word;
        max-width: 300px;
      }
      .pdf-content img {
        max-width: 100%;
        height: auto;
        page-break-inside: avoid;
      }
      /* KaTeX specific styles */
      .pdf-content .katex-display,
      .pdf-content p:has(.katex),
      .pdf-content span:has(.katex) {
        display: block !important;
        page-break-inside: avoid !important;
        page-break-before: auto !important;
        page-break-after: auto !important;
        break-inside: avoid !important;
        margin: 1em auto !important;
        padding: 0.5em 0 !important;
        overflow: visible !important;
        min-height: fit-content !important;
        position: relative !important;
      }
      .pdf-content .katex {
        display: inline-block !important;
        white-space: normal !important;
        text-indent: 0 !important;
        text-align: left !important;
        text-rendering: auto !important;
        font-size: 1.1em !important;
        line-height: 1.4 !important;
        overflow: visible !important;
        vertical-align: middle !important;
      }
      .pdf-content .katex .base {
        margin-top: 2px !important;
        margin-bottom: 2px !important;
        position: relative !important;
        display: inline-flex !important;
        align-items: center !important;
        min-height: 1.5em !important;
      }
      .pdf-content .katex .msupsub {
        text-align: left !important;
        position: relative !important;
        top: auto !important;
        right: auto !important;
        bottom: auto !important;
        left: auto !important;
        display: inline-flex !important;
        align-items: flex-start !important;
        margin: 0 0.1em !important;
      }
      .pdf-content .katex .msupsub .vlist-t {
        position: relative !important;
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      .pdf-content .katex .msupsub .vlist-t .vlist-r {
        display: inline-flex !important;
        flex-direction: column !important;
      }
      .pdf-content .katex .msupsub .vlist-t .vlist-r .vlist {
        display: inline-flex !important;
        flex-direction: column !important;
        position: relative !important;
      }
      .pdf-content .katex .mord.text {
        padding: 0 !important;
        margin: 0 !important;
        position: relative !important;
      }
      .pdf-content .katex .mspace {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      .pdf-content .katex .vlist-t2 {
        margin-right: 0 !important;
        position: relative !important;
      }
      .pdf-content .katex .vlist-r {
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      .pdf-content .katex .vlist {
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        position: relative !important;
      }
      .pdf-content .katex .reset-textstyle.scriptstyle {
        font-size: 0.7em !important;
        position: relative !important;
        top: 0.25em !important;
      }
      .pdf-content .katex .reset-textstyle.scriptscriptstyle {
        font-size: 0.5em !important;
        position: relative !important;
        top: 0.25em !important;
      }
      @page {
        margin: 0;
        size: letter;
      }
    `;
    wrapper.appendChild(style);

    // Configure PDF options
    const opt = {
      margin: 0,
      filename: `document-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 816, // 8.5in * 96dpi
        width: 816,
        height: undefined,
        onclone: function(clonedDoc) {
          const content = clonedDoc.querySelector('.pdf-content');
          if (content) {
            content.style.height = 'auto';
            content.style.minHeight = '11in';
            
            // Fix equation containers
            const equations = content.querySelectorAll('.katex-display, .katex, p:has(.katex), span:has(.katex)');
            equations.forEach(eq => {
              // Ensure equation container is properly styled
              eq.style.display = 'block';
              eq.style.width = 'auto';
              eq.style.maxWidth = '100%';
              eq.style.margin = '1em auto';
              eq.style.padding = '0.5em 0';
              eq.style.pageBreakInside = 'avoid';
              eq.style.breakInside = 'avoid';
              eq.style.overflow = 'visible';
              eq.style.position = 'relative';
              
              // Fix subscript positioning
              const subscripts = eq.querySelectorAll('.msupsub');
              subscripts.forEach(sub => {
                sub.style.position = 'relative';
                sub.style.display = 'inline-flex';
                sub.style.alignItems = 'flex-start';
                sub.style.margin = '0 0.1em';
                
                const vlistT = sub.querySelector('.vlist-t');
                if (vlistT) {
                  vlistT.style.position = 'relative';
                  vlistT.style.display = 'inline-flex';
                  vlistT.style.flexDirection = 'column';
                  vlistT.style.alignItems = 'flex-start';
                }
              });
              
              // Add extra space after equations near page boundaries
              const rect = eq.getBoundingClientRect();
              const pageHeight = 11 * 96; // 11 inches in pixels
              const bottomMargin = pageHeight - (rect.top % pageHeight);
              
              if (bottomMargin < rect.height + 50) { // If equation is close to page bottom
                eq.style.marginBottom = '1in'; // Force it to next page
              }
            });
          }
        }
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true,
        precision: 16,
        putTotalPages: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: [
          '.katex-display',
          '.katex',
          'p:has(.katex)',
          'span:has(.katex)',
          'tr',
          'td',
          'pre',
          'img',
          'h1',
          'h2',
          'h3'
        ]
      }
    };

    // Generate PDF
    html2pdf()
      .set(opt)
      .from(wrapper)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        // Add metadata
        pdf.setProperties({
          title: 'Document',
          subject: 'Generated Document',
          creator: 'Universal Text Converter',
          author: 'Universal Text Converter'
        });
      })
      .save();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      title="Download as PDF"
    >
      <FaFilePdf />
      <span>Download PDF</span>
    </button>
  );
};

export default DownloadPdfButton;
