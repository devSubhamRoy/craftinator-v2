import React from 'react';
import { Award, Users } from 'lucide-react';

export default function ConversationItem({
  conversation,
  isActive,
  onSelect
}) {
  const lastMsg = conversation.messages[conversation.messages.length - 1];
  
  // Format last message text
  const previewText = lastMsg
    ? lastMsg.sender === 'user' ? `You: ${lastMsg.text}` : lastMsg.text
    : 'No messages yet';

  const timeDisplay = conversation.timeAgo || lastMsg?.timestamp || '';

  return (
    <li className="chat-conv-item">
      <button
        type="button"
        className={`chat-conv-btn ${isActive ? 'active' : ''}`}
        onClick={() => onSelect(conversation.id)}
        aria-selected={isActive}
      >
        {/* Avatar with Status Indicator */}
        <div className="chat-avatar-wrap">
          {conversation.avatar ? (
            <img
              src={conversation.avatar}
              alt={conversation.artisanName}
              className="chat-avatar-img"
              loading="lazy"
            />
          ) : (
            <div className="chat-avatar-fallback">
              <Users size={20} />
            </div>
          )}
          <span
            className={`chat-status-dot ${conversation.onlineStatus || 'offline'}`}
            title={conversation.statusText || 'Offline'}
          />
        </div>

        {/* Conversation details */}
        <div className="chat-conv-details">
          <div className="chat-conv-top-row">
            <div className="chat-conv-name-row">
              <span className="chat-conv-name">{conversation.artisanName}</span>
              {conversation.verified && (
                <Award size={13} className="chat-verified-badge" title="Verified Artisan/Guild" />
              )}
            </div>
            <span className="chat-conv-time">{timeDisplay}</span>
          </div>

          <div className="chat-conv-bottom-row">
            <p className="chat-conv-preview" title={previewText}>
              {previewText}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="chat-conv-unread-pill" title={`${conversation.unreadCount} unread`}>
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}
