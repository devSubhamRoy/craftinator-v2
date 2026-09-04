import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, SUPPORTED_LANGUAGES } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // 1. Check URL query params (?lang=de)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang')?.toLowerCase();
    if (urlLang && SUPPORTED_LANGUAGES.some(l => l.code === urlLang)) {
      return urlLang;
    }

    // 2. Check localStorage
    const savedLang = localStorage.getItem('craftinator_lang');
    if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
      return savedLang;
    }

    // 3. Default to English
    return 'en';
  });

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    // Sync document attributes
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', currentLangObj.dir || 'ltr');

    // Save preference
    localStorage.setItem('craftinator_lang', language);

    // Sync URL search query
    const url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== language) {
      url.searchParams.set('lang', language);
      window.history.replaceState({}, '', url.toString());
    }
  }, [language, currentLangObj]);

  const changeLanguage = (newLangCode) => {
    if (SUPPORTED_LANGUAGES.some(l => l.code === newLangCode)) {
      setLanguage(newLangCode);
    }
  };

  const t = (key, fallbackText) => {
    if (!key) return '';
    const langDict = translations[language] || translations['en'];
    if (langDict && langDict[key]) return langDict[key];
    if (translations['en'] && translations['en'][key]) return translations['en'][key];
    if (fallbackText) return fallbackText;
    // Smart humanization fallback (e.g. "my_new_section" -> "My New Section")
    return typeof key === 'string'
      ? key.replace(/^[a-z]+_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLangObj,
        supportedLanguages: SUPPORTED_LANGUAGES,
        changeLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
