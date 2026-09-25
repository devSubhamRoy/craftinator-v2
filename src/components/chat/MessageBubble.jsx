import React from 'react';
import { ExternalLink, Link2, Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({
  message,
  onProductClick,
  onAcceptQuote
}) {
  const isUser = message.sender === 'user';

  return (
    <div className={`chat-message-row ${isUser ? 'sender-user' : 'sender-incoming'}`}>
      <div className="chat-bubble">
        
        {/* Main Text Content */}
        {message.text && (
          <p className="chat-bubble-text">{message.text}</p>
        )}

        {/* Link Attachment Preview (Matches Screenshot 2 https://discord.com/) */}
        {message.linkAttachment && (
          <a
            href={message.linkAttachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link-preview-box"
          >
            <span className="chat-link-url">{message.linkAttachment.url}</span>
            <Link2 size={15} className="chat-link-icon" />
          </a>
        )}

        {/* Product Attachment Preview Card */}
        {message.productAttachment && (
          <div
            className="chat-product-attachment"
            onClick={() => onProductClick && onProductClick(message.productAttachment)}
            title="Click to view artisan piece"
          >
            <img
              src={message.productAttachment.image}
              alt={message.productAttachment.name}
              className="chat-attachment-img"
              loading="lazy"
            />
            <div className="chat-attachment-details">
              <span className="chat-attachment-title">{message.productAttachment.name}</span>
              <span className="chat-attachment-price">₹{message.productAttachment.price.toLocaleString('en-IN')}</span>
            </div>
            <ExternalLink size={14} style={{ opacity: 0.7 }} />
          </div>
        )}

        {/* Custom Order Quote Card */}
        {message.customQuoteAttachment && (
          <div className="chat-quote-card">
            <div className="chat-quote-header">
              <span className="chat-quote-tag">{message.customQuoteAttachment.status}</span>
              <span className="chat-quote-eta">
                {message.customQuoteAttachment.estimatedDays}
              </span>
            </div>
            <h4 className="chat-quote-title">{message.customQuoteAttachment.title}</h4>
            <div className="chat-quote-amount">
              ₹{message.customQuoteAttachment.quoteAmount.toLocaleString('en-IN')}
            </div>
            <button
              type="button"
              className="btn btn-terracotta chat-quote-accept-btn"
              onClick={() => onAcceptQuote && onAcceptQuote(message.customQuoteAttachment)}
            >
              <span>Accept & Secure Slot</span>
            </button>
          </div>
        )}

        {/* Media Photo Attachment */}
        {message.mediaAttachment && (
          <div className="chat-media-attachment">
            <img
              src={message.mediaAttachment.url}
              alt="Atelier update"
              className="chat-media-img"
              loading="lazy"
            />
            {message.mediaAttachment.caption && (
              <p className="chat-media-caption">{message.mediaAttachment.caption}</p>
            )}
          </div>
        )}

        {/* Subtle Inline Timestamp & Read Receipt */}
        <div className="chat-bubble-meta">
          <span className="chat-bubble-timestamp">{message.timestamp}</span>
          {isUser && (
            message.status === 'read' ? (
              <CheckCheck size={13} className="chat-read-icon" title="Read" />
            ) : (
              <Check size={13} className="chat-read-icon" title="Delivered" />
            )
          )}
        </div>

      </div>
    </div>
  );
}
