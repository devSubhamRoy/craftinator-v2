import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { useLanguage } from '../../i18n/LanguageContext';

export default function MessageList({
  messages,
  isTyping,
  artisanName,
  onProductClick,
  onAcceptQuote
}) {
  const { t } = useLanguage();
  const endRef = useRef(null);

  const streamRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages?.length, isTyping]);

  return (
    <div
      ref={streamRef}
      className="chat-messages-stream"
      tabIndex={0}
      role="region"
      aria-label={t('chat_messages_stream', 'Conversation messages stream')}
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          onProductClick={onProductClick}
          onAcceptQuote={onAcceptQuote}
        />
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="chat-typing-row animate-fade-in" aria-live="polite">
          <div className="chat-typing-bubble">
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
          </div>
          <span className="chat-typing-label">
            {artisanName} {t('chat_is_typing', 'is typing...')}
          </span>
        </div>
      )}

      <div ref={endRef} style={{ height: '1px' }} />
    </div>
  );
}
