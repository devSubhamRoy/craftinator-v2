import React from 'react';
import { X, Clock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function StoryModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container story-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose} aria-label="Close story reader">
          <X size={22} />
        </button>

        <div className="story-modal-content">
          <span className="eyebrow">{t('story_badge')}</span>
          
          <h2 className="heading-lg story-modal-heading">
            {t('story_modal_title')}
          </h2>

          <div className="story-meta-row">
            <div className="author-tag">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" alt="Author" />
              <span>Craftinator Editorial Team</span>
            </div>
            <div className="read-time flex items-center gap-1">
              <Clock size={14} />
              <span>6 min read</span>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop"
            alt="Artisan at pottery wheel"
            className="story-main-img img-cover"
          />

          <div className="story-article-body">
            <p>
              {t('story_subtitle')}
            </p>

            <h3>1. {t('bv_1_title')}</h3>
            <p>
              {t('bv_1_desc')}
            </p>

            <blockquote>
              "{t('hero_subtitle')}"
            </blockquote>

            <h3>2. {t('bv_3_title')}</h3>
            <p>
              {t('bv_3_desc')}
            </p>
          </div>

          <div className="story-footer">
            <button className="btn btn-primary" onClick={onClose}>
              {t('story_modal_close')}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
