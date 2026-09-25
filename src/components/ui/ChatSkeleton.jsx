import React from 'react';

/**
 * High-Fidelity Chat Skeleton Loading Placeholder
 * Replicates the 2-column layout of the Artisan Chat Page
 */
export default function ChatSkeleton() {
  return (
    <div className="chat-page-root chat-skeleton-root" aria-busy="true" aria-label="Loading artisan messages">
      <div className="chat-layout-container">
        
        {/* 1. Left Sidebar Skeleton (Conversations List) */}
        <aside className="chat-sidebar-column">
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-title-row">
              <div className="skel-block" style={{ width: '80px', height: '28px', borderRadius: '6px' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="skel-block" style={{ width: '64px', height: '32px', borderRadius: '16px' }} />
                <div className="skel-block" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              </div>
            </div>
            <div className="skel-block" style={{ width: '100%', height: '40px', borderRadius: '20px' }} />
          </div>

          <div className="chat-conversations-scroll-wrap" style={{ padding: '0.5rem 0' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={`skel-conv-${i}`} className="chat-conv-btn" style={{ pointerEvents: 'none' }}>
                <div className="skel-block" style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <div className="skel-block" style={{ width: '120px', height: '16px', borderRadius: '4px' }} />
                    <div className="skel-block" style={{ width: '35px', height: '12px', borderRadius: '4px' }} />
                  </div>
                  <div className="skel-block" style={{ width: '75%', height: '13px', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* 2. Right Chat Window Skeleton */}
        <section className="chat-main-column">
          {/* Active Chat Header */}
          <div className="chat-window-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="skel-block" style={{ width: '44px', height: '44px', borderRadius: '50%' }} />
              <div>
                <div className="skel-block" style={{ width: '140px', height: '18px', marginBottom: '0.35rem', borderRadius: '4px' }} />
                <div className="skel-block" style={{ width: '180px', height: '12px', borderRadius: '4px' }} />
              </div>
            </div>
            <div className="skel-block" style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
          </div>

          {/* Messages Stream */}
          <div className="chat-messages-stream">
            {/* Incoming message bubble */}
            <div className="chat-message-row sender-incoming">
              <div className="skel-block" style={{ width: '280px', height: '56px', borderRadius: '18px 18px 18px 4px' }} />
            </div>

            {/* Outgoing user message bubble */}
            <div className="chat-message-row sender-user">
              <div className="skel-block" style={{ width: '200px', height: '42px', borderRadius: '18px 18px 4px 18px' }} />
            </div>

            {/* Incoming message */}
            <div className="chat-message-row sender-incoming">
              <div className="skel-block" style={{ width: '310px', height: '64px', borderRadius: '18px 18px 18px 4px' }} />
            </div>

            {/* Outgoing with link preview */}
            <div className="chat-message-row sender-user">
              <div className="skel-block" style={{ width: '260px', height: '74px', borderRadius: '18px 18px 4px 18px' }} />
            </div>
          </div>

          {/* Bottom Composer Area */}
          <div className="chat-input-bar">
            <div className="skel-block" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <div className="skel-block" style={{ flex: 1, height: '44px', borderRadius: '22px' }} />
            <div className="skel-block" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          </div>
        </section>

      </div>
    </div>
  );
}
