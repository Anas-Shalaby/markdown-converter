import React, { useRef } from 'react';
import FormatToolbar from './FormatToolbar';

const Editor = ({ value, onChange, mode }) => {
  const textareaRef = useRef(null);
  const placeholder = mode === 'markdown' 
    ? "Enter your markdown here..."
    : "Enter your text here...";

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // Find the start and end of the current line
    let lineStart = text.lastIndexOf('\n', start - 1) + 1;
    if (lineStart === -1) lineStart = 0;
    let lineEnd = text.indexOf('\n', start);
    if (lineEnd === -1) lineEnd = text.length;
    
    let newText = text;
    const currentLine = text.substring(lineStart, lineEnd);

    switch (format) {
      case 'h1':
        if (mode === 'text') {
          const hasH1 = currentLine.startsWith('[H1]');
          newText = text.substring(0, lineStart) +
                   (hasH1 ? currentLine.substring(4) : '[H1]' + currentLine) +
                   text.substring(lineEnd);
        }
        break;
      case 'bold':
        if (mode === 'text' && start !== end) {
          const selectedText = text.substring(start, end);
          newText = text.substring(0, start) +
                   '[B]' + selectedText + '[/B]' +
                   text.substring(end);
        }
        break;
      case 'italic':
        if (mode === 'text' && start !== end) {
          const selectedText = text.substring(start, end);
          newText = text.substring(0, start) +
                   '[I]' + selectedText + '[/I]' +
                   text.substring(end);
        }
        break;
    }

    onChange(newText);
    
    // Restore focus to textarea
    textarea.focus();
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-600">
          {mode === 'markdown' ? 'Markdown Editor' : 'Text Editor'}
        </h2>
      </div>
      {mode === 'text' && <FormatToolbar onFormat={handleFormat} />}
      <textarea
        ref={textareaRef}
        className="w-full h-[calc(100%-40px)] p-4 focus:outline-none focus:ring-0 resize-none font-mono text-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Editor;