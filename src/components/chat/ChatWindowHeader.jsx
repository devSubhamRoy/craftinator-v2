import React from 'react';
import { ArrowLeft, MoreHorizontal, Award, ShieldCheck } from 'lucide-react';

export default function ChatWindowHeader({
  conversation,
  onBack,
  onOptionsClick,
  onAvatarClick
}) {
  if (!conversation) return null;

  return (
    <div className="chat-window-header">
      <div className="chat-header-left">
        {/* Mobile Back Button */}
        <button
          type="button"
          className="chat-back-mobile-btn"
          onClick={onBack}
          aria-label="Back to conversations"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Avatar */}
        <div className="chat-header-avatar-wrap" onClick={onAvatarClick}>
          <img
            src={conversation.avatar}
            alt={conversation.artisanName}
            className="chat-header-avatar"
          />
          <span className={`chat-status-dot ${conversation.onlineStatus || 'offline'}`} />
        </div>

        {/* Title and subtitle */}
        <div className="chat-header-info">
          <div className="chat-header-name-row">
            <h2 className="chat-header-name" onClick={onAvatarClick}>
              {conversation.artisanName}
            </h2>
            {conversation.verified && (
              <Award size={14} className="chat-verified-badge" title="Verified Artisan/Guild" />
            )}
          </div>
          <span className="chat-header-subtext">
            {conversation.statusText || conversation.craft}
          </span>
        </div>
      </div>

      {/* Right: Three-dot options button */}
      <div className="chat-header-right">
        <button
          type="button"
          className="chat-action-round-btn"
          onClick={onOptionsClick}
          aria-label="Conversation options"
          title="Conversation options"
        >
          <MoreHorizontal size={19} />
        </button>
      </div>
    </div>
  );
}
