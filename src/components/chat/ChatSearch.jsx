import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ChatSearch({ value, onChange, onClear }) {
  const { t } = useLanguage();

  return (
    <div className="chat-search-pill-wrapper">
      <Search size={16} className="chat-search-pill-icon" />
      <input
        type="text"
        className="chat-search-pill-input"
        placeholder={t('chat_search_placeholder', 'Search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search conversations"
      />
      {value && (
        <button
          type="button"
          className="chat-search-pill-clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
