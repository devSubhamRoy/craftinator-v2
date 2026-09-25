import React, { useState, useRef } from 'react';
import { Send, Paperclip, Eye } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function MessageComposer({
  isReadOnly = false,
  readOnlyNotice,
  quickReplies = [],
  onSendMessage,
  onAttachClick,
  artisanName
}) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  // If conversation is read-only (Matches Screenshot 2!)
  if (isReadOnly) {
    return (
      <div className="chat-readonly-container" role="status">
        <div className="chat-readonly-bar">
          <Eye size={16} className="chat-readonly-icon" />
          <span>{readOnlyNotice || t('chat_readonly_mode', 'This conversation is currently in read-only mode.')}</span>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleQuickReply = (reply) => {
    onSendMessage(reply);
  };

  return (
    <div className="chat-composer-wrap">
      {/* Quick Reply Pills */}
      {quickReplies && quickReplies.length > 0 && (
        <div className="chat-quick-replies-bar">
          {quickReplies.map((reply, i) => (
            <button
              key={`quick-pill-${i}`}
              type="button"
              className="chat-quick-pill"
              onClick={() => handleQuickReply(reply)}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Main Composer Bar */}
      <div className="chat-input-bar">
        <button
          type="button"
          className="chat-attach-btn"
          onClick={onAttachClick}
          aria-label="Attach file or photo"
          title="Attach photo or commission brief"
        >
          <Paperclip size={18} />
        </button>

        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chat-text-input"
            placeholder={t('chat_composer_placeholder', `Message ${artisanName || 'artisan'}...`)}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Type message"
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!text.trim()}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
