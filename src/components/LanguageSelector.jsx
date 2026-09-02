import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSelector({ isMobile = false }) {
  const { language, currentLangObj, supportedLanguages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`lang-selector-wrapper ${isMobile ? 'mobile-lang' : ''}`} ref={dropdownRef}>
      <button
        className="lang-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe size={18} className="lang-globe-icon" />
        <span className="lang-flag">{currentLangObj.flag}</span>
        <span className="lang-code-text">{currentLangObj.nativeName}</span>
        <ChevronDown size={14} className={`lang-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          <div className="lang-dropdown-header">Select Language</div>
          <div className="lang-options-list">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                className={`lang-option-item ${language === lang.code ? 'active' : ''}`}
                onClick={() => handleSelect(lang.code)}
              >
                <span className="lang-option-flag">{lang.flag}</span>
                <div className="lang-option-labels">
                  <span className="lang-option-native">{lang.nativeName}</span>
                  <span className="lang-option-en">{lang.name}</span>
                </div>
                {language === lang.code && <Check size={16} className="lang-active-check" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
