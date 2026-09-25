import React from 'react';
import { Edit3, RotateCw } from 'lucide-react';
import ChatFilter from './ChatFilter';
import ChatSearch from './ChatSearch';
import ConversationList from './ConversationList';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ChatSidebar({
  conversations,
  activeConvId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  onClearSearch,
  activeFilter,
  onFilterChange,
  onNewChat,
  onRefresh,
  isHiddenOnMobile = false
}) {
  const { t } = useLanguage();

  return (
    <aside className={`chat-sidebar-column ${isHiddenOnMobile ? 'mobile-hidden' : ''}`}>
      {/* 1. Header with Title, Filter Dropdown & Action Icon */}
      <div className="chat-sidebar-header">
        <div className="chat-sidebar-title-row">
          <h1 className="chat-sidebar-title">{t('chat_heading', 'Chat')}</h1>
          
          <div className="chat-sidebar-header-actions">
            <ChatFilter
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
            />

            <button
              type="button"
              className="chat-action-round-btn"
              onClick={onNewChat}
              title={t('chat_new_chat', 'New Chat')}
              aria-label="Start new chat"
            >
              <Edit3 size={17} />
            </button>
          </div>
        </div>

        {/* 2. Search Pill Input */}
        <ChatSearch
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onClearSearch}
        />
      </div>

      {/* 3. Independently Scrollable Conversations List */}
      <ConversationList
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={onSelectConversation}
      />
    </aside>
  );
}
