import React, { createContext, useState, useContext, useEffect } from 'react';

// Translations
const translations = {
  en: {
    title: 'Universal Text Converter',
    subtitle: 'Convert between Markdown and Plain Text with ease',
    conversionToggle: {
      markdown: 'Markdown',
      plainText: 'Plain Text',
      switch: 'Switch Mode'
    },
    buttons: {
      download: 'Download',
      copy: 'Copy Text',
      copied: 'Copied!',
      switchMode: 'Switch Mode',
      menu: 'Menu',
      language: 'Language',
      darkMode: 'Dark Mode',
      pdf: 'PDF',
      word: 'Word',
      powerpoint: 'PowerPoint'
    },
    placeholders: {
      markdownEditor: 'Enter Markdown text here...',
      plainTextEditor: 'Enter plain text here...'
    },
    footer: '2024 Universal Text Converter. All rights reserved.'
  },
  ar: {
    title: 'محول النصوص العالمي',
    subtitle: 'حول بين Markdown والنص العادي بسهولة',
    conversionToggle: {
      markdown: 'Markdown',
      plainText: 'نص عادي',
      switch: 'تبديل الوضع',
    },
    buttons: {
      download: 'تنزيل',
      copy: 'نسخ النص',
      copied: 'تم النسخ!',
      switchMode: 'تبديل الوضع',
      menu: 'القائمة',
      language: 'اللغة',
      darkMode: 'الوضع المظلم',
      pdf: 'PDF',
      word: 'Word',
      powerpoint: 'PowerPoint'
    },
    placeholders: {
      markdownEditor: 'أدخل نص Markdown هنا...',
      plainTextEditor: 'أدخل النص العادي هنا...'
    },
    footer: '2024 محول النصوص العالمي. جميع الحقوق محفوظة.'
  }
};

// Create context
export const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage for saved language, default to English
    return localStorage.getItem('appLanguage') || 'en';
  });

  const [isRTL, setIsRTL] = useState(language === 'ar');

  useEffect(() => {
    // Update localStorage when language changes
    localStorage.setItem('appLanguage', language);
    
    // Update RTL based on language
    setIsRTL(language === 'ar');

    // Update document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    // Navigate through nested translation keys
    return key.split('.').reduce((obj, k) => obj[k], translations[language]);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        isRTL, 
        t, 
        translations,
        isDarkMode: false 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = () => useContext(LanguageContext);
