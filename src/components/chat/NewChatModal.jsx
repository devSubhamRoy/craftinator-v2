import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Award } from 'lucide-react';
import { artisans } from '../../data/artisans';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function NewChatModal({
  isOpen,
  onClose,
  onStartChat
}) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const backdropRef = useRef(null);

  useBodyScrollLock(isOpen, {
    containerRef,
    backdropRef,
    onClose,
  });

  if (!isOpen) return null;

  const filteredArtisans = artisans.filter(artisan => {
    const q = searchTerm.toLowerCase();
    return artisan.name.toLowerCase().includes(q) ||
      artisan.craft.toLowerCase().includes(q) ||
      artisan.city.toLowerCase().includes(q);
  });

  const modalContent = (
    <div ref={backdropRef} className="new-chat-modal-backdrop" onClick={onClose}>
      <div
        ref={containerRef}
        className="new-chat-modal-panel animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-chat-title"
      >
        {/* Header */}
        <div className="new-chat-modal-header">
          <h3 id="new-chat-title" className="new-chat-title">{t('chat_new_conv', 'Start New Conversation')}</h3>
          <button
            type="button"
            className="new-chat-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="new-chat-search-wrap">
          <Search size={16} className="new-chat-search-icon" />
          <input
            type="text"
            className="new-chat-search-input"
            placeholder={t('chat_search_artisans', 'Search master artisans by name or craft...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {/* Artisans list */}
        <ul className="new-chat-artisans-list">
          {filteredArtisans.map((artisan) => (
            <li key={artisan.id} className="new-chat-artisan-item">
              <button
                type="button"
                className="new-chat-artisan-btn"
                onClick={() => {
                  onStartChat(artisan);
                  onClose();
                }}
              >
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="new-chat-artisan-avatar"
                />
                <div className="new-chat-artisan-info">
                  <div className="new-chat-artisan-name-row">
                    <span className="new-chat-artisan-name">{artisan.name}</span>
                    <Award size={13} className="chat-verified-badge" />
                  </div>
                  <span className="new-chat-artisan-sub">
                    {artisan.craft} · {artisan.city}, {artisan.state}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}
