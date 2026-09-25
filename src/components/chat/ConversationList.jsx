import React from 'react';
import { MessageSquare } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ConversationList({
  conversations,
  activeConvId,
  onSelectConversation
}) {
  const { t } = useLanguage();

  if (conversations.length === 0) {
    return (
      <div
        className="chat-conversations-scroll-wrap chat-empty-inbox-wrap"
        tabIndex={0}
        role="region"
        aria-label={t('chat_conversations', 'Conversations')}
      >
        <div className="chat-empty-inbox">
          <MessageSquare size={36} strokeWidth={1.5} className="empty-inbox-icon" />
          <p>{t('chat_no_conv', 'No conversations found')}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="chat-conversations-scroll-wrap"
      tabIndex={0}
      role="region"
      aria-label={t('chat_conversations', 'Conversations')}
    >
      <ul className="chat-conversations-list" role="list">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeConvId}
            onSelect={onSelectConversation}
          />
        ))}
      </ul>
    </div>
  );
}
