import React, { useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import { useLanguage } from '../../i18n/LanguageContext';

export default function MessageList({
  conversationId,
  messages = [],
  isTyping,
  artisanName,
  onProductClick,
  onAcceptQuote
}) {
  const { t } = useLanguage();
  const endRef = useRef(null);
  const streamRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const prevMessagesLengthRef = useRef(messages?.length || 0);
  const isNearBottomRef = useRef(true);

  // Instant scroll to bottom without any animation
  const scrollToBottomInstant = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, []);

  // Smooth scroll to bottom for live new messages
  const scrollToBottomSmooth = useCallback(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Track if user is currently near the bottom of the stream (within 120px)
  const handleScroll = useCallback(() => {
    if (!streamRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = streamRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    isNearBottomRef.current = distanceFromBottom <= 120;
  }, []);

  // 1. INITIAL MOUNT / CONVERSATION OPEN:
  // Synchronously set initial scroll position = scrollHeight BEFORE browser paint.
  // This guarantees user NEVER sees top or middle messages, and zero gliding motion.
  useLayoutEffect(() => {
    isInitialLoadRef.current = true;
    prevMessagesLengthRef.current = messages?.length || 0;
    isNearBottomRef.current = true;

    // Instant execution before browser paint
    scrollToBottomInstant();

    // Micro-frame assurance to handle font and DOM layout settling
    const rafId = requestAnimationFrame(() => {
      scrollToBottomInstant();
    });

    const timer = setTimeout(() => {
      scrollToBottomInstant();
      isInitialLoadRef.current = false;
    }, 40);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [conversationId, scrollToBottomInstant]);

  // 2. SUBSEQUENT MESSAGES OR TYPING UPDATES:
  useEffect(() => {
    if (isInitialLoadRef.current) return;

    const messageCountDiff = (messages?.length || 0) - prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages?.length || 0;

    if (messageCountDiff > 0) {
      const lastMessage = messages[messages.length - 1];
      const isSentByMe = lastMessage?.sender === 'user';

      // Always scroll to bottom if current user sent the message,
      // or if user was already at the bottom reading the stream.
      // If user has manually scrolled up reading older messages, do NOT forcefully hijack scroll!
      if (isSentByMe || isNearBottomRef.current) {
        scrollToBottomSmooth();
      }
    } else if (isTyping && isNearBottomRef.current) {
      scrollToBottomSmooth();
    }
  }, [messages, isTyping, scrollToBottomSmooth]);

  return (
    <div
      ref={streamRef}
      className="chat-messages-stream"
      onScroll={handleScroll}
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
