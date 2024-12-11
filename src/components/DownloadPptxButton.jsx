import React from 'react';
import pptxgen from 'pptxgenjs';

const DownloadPptxButton = ({ content, mode }) => {
  const handleDownload = async () => {
    const pres = new pptxgen();
    
    // Split content into slides based on headers or double newlines
    const slides = content
      .split(/(?=# )|(?=## )|(?=### )|(?:\n\n)/g)
      .filter(slide => slide.trim())
      .map(slide => slide.trim());
    
    slides.forEach((slideContent) => {
      const slide = pres.addSlide();
      
      // Add a simple white background
      slide.background = { color: "FFFFFF" };
      
      // Process the content to ensure proper line breaks
      const processedContent = slideContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
      
      // Calculate optimal text box position and size
      const contentLength = processedContent.length;
      const fontSize = contentLength > 200 ? 14 : contentLength > 100 ? 16 : 18;
      
      // Add text to the slide with improved formatting
      slide.addText(processedContent, {
        x: '10%',          // Increased left margin
        y: '10%',          // Increased top margin
        w: '80%',          // Reduced width to prevent text from being too close to edges
        h: '75%',          // Reduced height to prevent overflow
        fontSize: fontSize,
        color: '363636',
        align: mode === 'markdown' ? 'left' : 'left',
        fontFace: 'Arial',
        bold: false,
        breakLine: true,
        lineSpacing: 32,   // Increased line spacing
        paraSpacing: { before: 2, after: 14 }, // Increased paragraph spacing
        isTextBox: true,
        fit: 'shrink',     // Shrink text to fit if needed
        wrap: true,
        vertical: 'top',
        margin: [15, 15, 15, 15], // Increased padding
        autoFit: true      // Added autoFit to help with text sizing
      });
    });

    // Save the presentation
    const fileName = 'presentation.pptx';
    await pres.writeFile({ fileName });
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      PowerPoint
    </button>
  );
};

export default DownloadPptxButton;
