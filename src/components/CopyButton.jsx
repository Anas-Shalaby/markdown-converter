import React, { useState } from 'react';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import { convertToRichText } from '../utils/copyUtils';

const CopyButton = ({ text, mode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const richText = convertToRichText(text, mode);
      
      // Create a temporary element to hold the formatted content
      const container = document.createElement('div');
      container.innerHTML = richText;
      
      // Create a clipboard item with both plain text and HTML formats
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([container.textContent], { type: 'text/plain' }),
        'text/html': new Blob([richText], { type: 'text/html' })
      });
      
      await navigator.clipboard.write([clipboardItem]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback to plain text copy if rich copy fails
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      title="Copy formatted text"
    >
      {copied ? (
        <>
          <FaCheck /> Copied!
        </>
      ) : (
        <>
          <FaRegCopy /> Copy Text
        </>
      )}
    </button>
  );
};

export default CopyButton;