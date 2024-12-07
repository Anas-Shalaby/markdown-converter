import React, { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import CopyButton from './components/CopyButton';
import ConversionToggle from './components/ConversionToggle';
import { textToMarkdown, markdownToText } from './utils/converter';

function App() {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('markdown'); // 'markdown' or 'text'

  const handleToggleMode = () => {
    const newMode = mode === 'markdown' ? 'text' : 'markdown';
    const convertedContent = newMode === 'markdown' 
      ? textToMarkdown(content)
      : markdownToText(content);
    setMode(newMode);
    setContent(convertedContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Universal Text Converter
          </h1>
          <p className="text-gray-600">
            Convert between Markdown and Plain Text with ease
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <ConversionToggle mode={mode} onToggle={handleToggleMode} />
          <CopyButton text={content} mode={mode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
          <Editor 
            value={content} 
            onChange={setContent}
            mode={mode}
          />
          <Preview 
            content={content}
            mode={mode}
          />
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Tip: Toggle between modes to convert your content automatically
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;