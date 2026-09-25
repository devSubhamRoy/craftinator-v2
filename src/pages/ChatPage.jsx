import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import NewChatModal from '../components/chat/NewChatModal';
import { initialConversations } from '../data/chatConversations';
import { artisans } from '../data/artisans';
import { products } from '../data/products';
import { ChatSkeleton } from '../components';

export default function ChatPage({
  onNavigate,
  onOpenProductModal,
  onOpenArtisanModal,
  showToast,
  isLoading = false
}) {
  // Parse initial query params (?artisan=maya-sharma or ?conv=...)
  const initialSelectedId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const isMobileOrTablet = window.innerWidth < 1024;
      // On mobile / tablet, NEVER auto-open any conversation on initial entry
      if (isMobileOrTablet) return null;

      const params = new URLSearchParams(window.location.search);
      const artisanParam = params.get('artisan');
      if (artisanParam) {
        const found = initialConversations.find(c => c.artisanId === artisanParam);
        if (found) return found.id;
      }
      const convParam = params.get('conv');
      if (convParam) {
        const found = initialConversations.find(c => c.id === convParam);
        if (found) return found.id;
      }
    }
    // On desktop without query params, default to null so right side shows "Start Conversation" empty state
    return null;
  }, []);

  // State
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConvId, setActiveConvId] = useState(initialSelectedId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'artisans' | 'custom' | 'unread'
  const [isTyping, setIsTyping] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Mobile / Tablet master-detail view state ('list' | 'chat')
  // ALWAYS starts with 'list' when opening /chat from ANY page on mobile or tablet (< 1024px)
  const [viewMode, setViewMode] = useState('list');

  // Handle browser back gesture/button on mobile & tablet
  useEffect(() => {
    function handlePopState(e) {
      if (window.innerWidth < 1024) {
        if (!e.state || e.state.chatView !== 'conversation') {
          setViewMode('list');
        } else if (e.state && e.state.chatView === 'conversation') {
          setViewMode('chat');
          if (e.state.convId) setActiveConvId(e.state.convId);
        }
      }
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Lock body scroll on /chat so conversation list and message list scroll independently
  useEffect(() => {
    document.body.classList.add('chat-page-active');
    return () => {
      document.body.classList.remove('chat-page-active');
    };
  }, []);

  // Active conversation object
  const activeConversation = useMemo(() => {
    if (!activeConvId) return null;
    return conversations.find(c => c.id === activeConvId) || null;
  }, [conversations, activeConvId]);

  // Filtered conversations list
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      // 1. Text Search Filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        conv.artisanName.toLowerCase().includes(query) ||
        conv.craft.toLowerCase().includes(query) ||
        conv.messages.some(m => m.text.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. Dropdown Filter
      if (activeFilter === 'artisans') return !conv.isReadOnly;
      if (activeFilter === 'custom') return conv.isCustomOrder;
      if (activeFilter === 'unread') return (conv.unreadCount || 0) > 0;
      return true;
    });
  }, [conversations, searchQuery, activeFilter]);

  // Select a conversation handler
  const handleSelectConversation = useCallback((convId) => {
    setActiveConvId(convId);
    setViewMode('chat');

    // Push history state on mobile/tablet so native browser Back returns to conversation list
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      window.history.pushState({ chatView: 'conversation', convId }, '', window.location.pathname);
    }

    // Clear unread count on select
    setConversations(prev => prev.map(c => {
      if (c.id === convId && c.unreadCount > 0) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
  }, []);

  // Back button on mobile / tablet: smoothly returns to Conversation List
  const handleBackToConversations = useCallback(() => {
    setViewMode('list');
    if (typeof window !== 'undefined' && window.history.state && window.history.state.chatView === 'conversation') {
      window.history.back();
    }
  }, []);

  // Send message handler
  const handleSendMessage = useCallback((text) => {
    if (!text || !activeConvId) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));

    // Trigger realistic artisan reply after 1.6s
    const targetConv = conversations.find(c => c.id === activeConvId);
    if (targetConv && !targetConv.isReadOnly) {
      setTimeout(() => {
        setIsTyping(true);
      }, 500);

      setTimeout(() => {
        setIsTyping(false);

        const replies = [
          `Thank you for your message! At our studio in ${targetConv.city}, we take great care in honoring traditional handcrafted techniques. I will review this right away.`,
          `Namaste! I would be delighted to assist you with this artisan inquiry. Each piece is slow-made to ensure heirloom quality.`,
          `I have noted your request. Feel free to explore our featured studio pieces, or let me know if you would like custom dimensions or a personalized inscription!`
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const artisanReply = {
          id: `reply-${Date.now()}`,
          sender: 'artisan',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };

        setConversations(prev => prev.map(c => {
          if (c.id === targetConv.id) {
            return {
              ...c,
              messages: [...c.messages, artisanReply]
            };
          }
          return c;
        }));

        if (showToast) {
          showToast(`New reply from ${targetConv.artisanName}`);
        }
      }, 2000);
    }
  }, [activeConvId, conversations, showToast]);

  // Start new chat with an artisan
  const handleStartNewChatWithArtisan = useCallback((artisan) => {
    const existing = conversations.find(c => c.artisanId === artisan.id);
    if (existing) {
      handleSelectConversation(existing.id);
      return;
    }

    const newConv = {
      id: `conv-${artisan.id}`,
      artisanId: artisan.id,
      artisanName: artisan.name,
      craft: artisan.craft,
      avatar: artisan.avatar,
      city: `${artisan.city}, ${artisan.state}`,
      studioName: `${artisan.name}'s Atelier`,
      onlineStatus: 'online',
      statusText: `Active in ${artisan.city} studio · Replies in ~1h`,
      responseRate: 'Typically replies within 1 hour',
      unreadCount: 0,
      isCustomOrder: true,
      isReadOnly: false,
      verified: true,
      timeAgo: 'Just now',
      quickReplies: [
        'Can you craft this in custom dimensions?',
        'What is the dispatch time?',
        'Do you accept bespoke commissions?'
      ],
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'artisan',
          text: `Namaste! Welcome to ${artisan.name}'s studio. How can I help you with our ${artisan.craft.toLowerCase()} collections?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setViewMode('chat');
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      window.history.pushState({ chatView: 'conversation', convId: newConv.id }, '', window.location.pathname);
    }
  }, [conversations, handleSelectConversation]);

  // Attachment handler
  const handleAttachClick = useCallback(() => {
    if (showToast) {
      showToast('Attach custom reference photo or commission brief');
    }
  }, [showToast]);

  // Options click handler
  const handleOptionsClick = useCallback(() => {
    if (showToast && activeConversation) {
      showToast(`${activeConversation.artisanName} studio options`);
    }
  }, [showToast, activeConversation]);

  // Avatar click handler
  const handleAvatarClick = useCallback(() => {
    if (activeConversation) {
      const foundArtisan = artisans.find(a => a.id === activeConversation.artisanId);
      if (onOpenArtisanModal && foundArtisan) {
        onOpenArtisanModal(foundArtisan);
      } else if (onNavigate) {
        onNavigate(`/artisan?id=${activeConversation.artisanId}`);
      }
    }
  }, [activeConversation, onOpenArtisanModal, onNavigate]);

  // Product click handler
  const handleProductClick = useCallback((attachment) => {
    const foundProduct = products.find(p => p.id === attachment.id);
    if (onOpenProductModal && foundProduct) {
      onOpenProductModal(foundProduct);
    } else if (onNavigate) {
      onNavigate(`/product?id=${attachment.id}`);
    }
  }, [onOpenProductModal, onNavigate]);

  // Quote accept handler
  const handleAcceptQuote = useCallback((quote) => {
    if (showToast) {
      showToast(`Commission proposal "${quote.title}" accepted!`);
    }
  }, [showToast]);

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <main className="chat-page-root animate-fade-in" id="chat-content">
      <div className="chat-layout-container">
        
        {/* 1. Left Sidebar (Conversation List) */}
        <ChatSidebar
          conversations={filteredConversations}
          activeConvId={activeConvId}
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onNewChat={() => setIsNewChatModalOpen(true)}
          isHiddenOnMobile={viewMode === 'chat'}
        />

        {/* 2. Right Conversation Area (Empty State OR Active Chat) */}
        <ChatWindow
          activeConversation={activeConversation}
          isTyping={isTyping}
          onBack={handleBackToConversations}
          onSendMessage={handleSendMessage}
          onAttachClick={handleAttachClick}
          onOptionsClick={handleOptionsClick}
          onAvatarClick={handleAvatarClick}
          onProductClick={handleProductClick}
          onAcceptQuote={handleAcceptQuote}
          onNewChat={() => setIsNewChatModalOpen(true)}
          isHiddenOnMobile={viewMode === 'list'}
        />

      </div>

      {/* New Chat Picker Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onStartChat={handleStartNewChatWithArtisan}
      />
    </main>
  );
}
