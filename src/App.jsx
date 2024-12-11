import React, { useState, useEffect } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import CopyButton from "./components/CopyButton";
import ConversionToggle from "./components/ConversionToggle";
import DownloadButton from "./components/DownloadButton";
import DownloadPptxButton from "./components/DownloadPptxButton";
import AdhkarToast from "./components/AdhkarToast";
import { Toaster } from "react-hot-toast";
import { textToMarkdown, markdownToText } from "./utils/converter";

function App() {
  const [content, setContent] = useState("");
  const [mode, setMode] = useState("markdown");
  const [processedContent, setProcessedContent] = useState("");

  // Process content whenever it changes or mode changes
  useEffect(() => {
    if (!content) {
      setProcessedContent("");
      return;
    }

    // Always process the content based on current mode
    const processed =
      mode === "markdown" ? textToMarkdown(content) : markdownToText(content);

    setProcessedContent(processed);
  }, [content, mode]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleToggleMode = () => {
    const newMode = mode === "markdown" ? "text" : "markdown";
    setMode(newMode);
  };

  const handlePreviewChange = (newContent) => {
    setProcessedContent(newContent);
    // Convert the preview content back to the original format
    if (mode === 'markdown') {
      setContent(markdownToText(newContent));
    } else {
      setContent(textToMarkdown(newContent));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Universal Text Converter</h1>
        <p className="text-gray-600">Convert between Markdown and Plain Text with ease</p>
      </div>

      <div className="justify-between items-center  mb-6  md:flex">
        <ConversionToggle mode={mode} onToggle={handleToggleMode} />
        <div className="flex justify-center mt-3 md:flex-row  gap-4">
          <DownloadButton content={processedContent} mode={mode} />
         
          <CopyButton text={processedContent} mode={mode} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
        <Editor 
          content={content} 
          setContent={setContent} 
          onChange={handleContentChange}
        />
        <Preview 
          content={processedContent} 
          mode={mode}
          onChange={handlePreviewChange}
        />
      </div>

      <footer className="text-center py-4 text-gray-500 text-sm">
        <p> 2024 Universal Text Converter. All rights reserved.</p>
      </footer>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'transform-gpu',
          duration: 5000,
        }}
      />
      <AdhkarToast />
    </div>
  );
}

export default App;
