import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ChatEmptyState({ onNewChat }) {
  const { t } = useLanguage();

  return (
    <div className="chat-empty-state-container" aria-label="No conversation selected">
      <div className="chat-empty-state-box">
        {/* Large Centered Circular Icon */}
        <div className="chat-empty-icon-circle">
          <MessageSquare size={38} strokeWidth={1.8} className="chat-empty-icon" />
        </div>

        {/* Heading & Supporting Text */}
        <h2 className="chat-empty-title">{t('chat_start_conv', 'Start Conversation')}</h2>
        <p className="chat-empty-desc">
          {t('chat_start_desc', 'Choose from your existing conversations, or start a new one.')}
        </p>

        {/* Primary Pill Button */}
        <button
          type="button"
          className="btn btn-primary chat-empty-new-btn"
          onClick={onNewChat}
        >
          <span>{t('chat_new_chat', 'New chat')}</span>
        </button>
      </div>
    </div>
  );
}
