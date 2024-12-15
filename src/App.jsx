import React, { useState, useEffect } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import CopyButton from "./components/CopyButton";
import ConversionToggle from "./components/ConversionToggle";
import DownloadButton from "./components/DownloadButton";
import DownloadPptxButton from "./components/DownloadPptxButton";
import AdhkarToast from "./components/AdhkarToast";
import ImageToText from "./components/ImageToText";
import { Toaster, toast } from "react-hot-toast";
import { textToMarkdown, markdownToText } from "./utils/converter";
import { FaMoon, FaSun, FaBars, FaTimes, FaLanguage } from 'react-icons/fa';
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

function AppContent() {
  const { language, setLanguage, isRTL, t } = useLanguage();
  
  // Check localStorage for initial dark mode preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    // Return true if savedTheme is 'true', otherwise false
    return savedTheme === 'true';
  });

  const [content, setContent] = useState("");
  const [mode, setMode] = useState("markdown");
  const [processedContent, setProcessedContent] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleImageUpload = ({ imageUrl, extractedText }) => {
    // Set the uploaded image URL for display
    setUploadedImageUrl(imageUrl);
    
    // Set the extracted text in the content
    setContent(extractedText);
    
    // Optionally, process the text if needed
    const processedText = mode === 'markdown' 
      ? textToMarkdown(extractedText) 
      : extractedText;
    
    setProcessedContent(processedText);
  };

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

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      // Save dark mode preference to localStorage
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      // Save dark mode preference to localStorage
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Responsive design effect
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      // Close mobile menu on larger screens
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  const renderMobileMenu = () => {
    if (!isMobileView || !isMobileMenuOpen) return null;

    return (
      <div className={`fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col p-6 ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {t('buttons.menu')}
          </h2>
          <button 
            onClick={toggleMobileMenu} 
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <ConversionToggle 
            mode={mode} 
            onToggle={() => {
              handleToggleMode();
              toggleMobileMenu();
            }} 
            isMobile={true}
          />
          
          <div className="flex items-center justify-between">
            <label className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'en' ? 'Dark Mode' : 'الوضع المظلم'}
            </label>
            <button 
              onClick={() => {
                handleToggleDarkMode();
                toggleMobileMenu();
              }} 
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'en' ? 'Language' : 'اللغة'}
            </label>
            <button 
              onClick={() => {
                handleLanguageToggle();
                toggleMobileMenu();
              }} 
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-green-400 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              aria-label="Toggle language"
            >
              <FaLanguage />
              {language === 'en' ? 'AR' : 'EN'}
            </button>
          </div>

          <div className="flex flex-col space-y-4 mt-4">
            <DownloadButton 
              content={processedContent} 
              mode={mode} 
              className="w-full py-3" 
            />
            <CopyButton 
              text={processedContent} 
              mode={mode} 
              className="w-full py-3" 
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'} p-6 transition-colors duration-300`}>
      {/* Mobile Header */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {t('title')}
        </h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLanguageToggle} 
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'text-green-400 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaLanguage className="h-6 w-6" />
          </button>
          <button 
            onClick={toggleMobileMenu} 
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaBars className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block text-center py-6">
        <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {t('title')}
        </h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('subtitle')}
        </p>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-between items-center mb-6">
        <ConversionToggle mode={mode} onToggle={handleToggleMode} />
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLanguageToggle} 
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'text-green-400 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Toggle language"
          >
            <FaLanguage className="h-6 w-6" />
          </button>
          <button 
            onClick={handleToggleDarkMode} 
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="flex justify-center mt-3 md:flex-row gap-4">
            <DownloadButton content={processedContent} mode={mode} />
            <CopyButton text={processedContent} mode={mode} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`container mx-auto px-4 py-8`}>
        <div className="flex justify-between items-center mb-6">
        <ImageToText onImageUpload={handleImageUpload} />        </div>

        {/* Add ImageToText component
        <div className="mb-6">
         
        </div> */}

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)] overflow-hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Editor 
            content={content} 
            setContent={setContent} 
            onChange={handleContentChange}
            isDarkMode={isDarkMode}
            mode={mode}
            isRTL={isRTL}
            uploadedImageUrl={uploadedImageUrl}
            className="h-full"
          />
          <Preview 
            content={processedContent} 
            mode={mode}
            onChange={handlePreviewChange}
            isDarkMode={isDarkMode}
            isRTL={isRTL}
            className="h-full"
          />
        </div>

        {/* Rest of the existing content */}
      </div>

      {/* Mobile Menu */}
      {renderMobileMenu()}

      <footer className={`text-center py-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
        <p>{t('footer')}</p>
      </footer>

      <Toaster
        position={isRTL ? "bottom-left" : "bottom-right"}
        toastOptions={{
          className: 'transform-gpu',
          duration: 5000,
          style: {
            background: isDarkMode ? '#2d3748' : '#ffffff',
            color: isDarkMode ? '#e2e8f0' : '#1a202c',
            border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
            direction: isRTL ? 'rtl' : 'ltr',
          },
          iconTheme: {
            primary: isDarkMode ? '#4299e1' : '#3182ce',
            secondary: isDarkMode ? '#e2e8f0' : '#ffffff',
          },
        }}
      />
      <AdhkarToast isDarkMode={isDarkMode} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
