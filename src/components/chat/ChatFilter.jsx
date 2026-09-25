import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ChatFilter({ activeFilter, onFilterChange }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = [
    { id: 'all', label: t('chat_filter_all', 'All') },
    { id: 'artisans', label: t('chat_filter_artisans', 'Artisans') },
    { id: 'custom', label: t('chat_filter_custom', 'Custom Orders') },
    { id: 'unread', label: t('chat_filter_unread', 'Unread') }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeLabel = filterOptions.find(f => f.id === activeFilter)?.label || 'All';

  return (
    <div className="chat-filter-container" ref={dropdownRef}>
      <button
        type="button"
        className={`chat-filter-pill-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{activeLabel}</span>
        <ChevronDown size={14} className={`filter-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <ul className="chat-filter-menu animate-fade-in" role="listbox">
          {filterOptions.map((opt) => (
            <li key={opt.id} role="option" aria-selected={activeFilter === opt.id}>
              <button
                type="button"
                className={`chat-filter-menu-item ${activeFilter === opt.id ? 'selected' : ''}`}
                onClick={() => {
                  onFilterChange(opt.id);
                  setIsOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {activeFilter === opt.id && <Check size={14} className="filter-check" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
