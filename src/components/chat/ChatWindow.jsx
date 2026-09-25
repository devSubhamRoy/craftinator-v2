import React from 'react';
import ChatWindowHeader from './ChatWindowHeader';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import ChatEmptyState from './ChatEmptyState';

export default function ChatWindow({
  activeConversation,
  isTyping,
  onBack,
  onSendMessage,
  onAttachClick,
  onOptionsClick,
  onAvatarClick,
  onProductClick,
  onAcceptQuote,
  onNewChat,
  isHiddenOnMobile = false
}) {
  return (
    <section className={`chat-main-column ${isHiddenOnMobile ? 'mobile-hidden' : ''}`}>
      {activeConversation ? (
        <>
          {/* 1. Window Header */}
          <ChatWindowHeader
            conversation={activeConversation}
            onBack={onBack}
            onOptionsClick={onOptionsClick}
            onAvatarClick={onAvatarClick}
          />

          {/* 2. Independently Scrollable Message Stream */}
          <MessageList
            messages={activeConversation.messages || []}
            isTyping={isTyping}
            artisanName={activeConversation.artisanName}
            onProductClick={onProductClick}
            onAcceptQuote={onAcceptQuote}
          />

          {/* 3. Sticky Bottom Composer (or Read-only Banner) */}
          <MessageComposer
            isReadOnly={activeConversation.isReadOnly}
            readOnlyNotice={activeConversation.readOnlyNotice}
            quickReplies={activeConversation.quickReplies}
            onSendMessage={onSendMessage}
            onAttachClick={onAttachClick}
            artisanName={activeConversation.artisanName}
          />
        </>
      ) : (
        /* Empty State when no conversation is selected */
        <ChatEmptyState onNewChat={onNewChat} />
      )}
    </section>
  );
}
