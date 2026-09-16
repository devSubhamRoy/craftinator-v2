# Craftinator-v2 Real-Time Architecture & WebSocket Roadmap

This document outlines the strategic roadmap and architectural blueprint for integrating real-time capabilities (WebSockets / PubSub) into **Craftinator-v2**.

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite SPA)                    │
│  - Custom Hooks: useRealtimeFeed, useArtisanChat, useLiveStock  │
│  - Socket Service Layer (Event-Driven Client Abstraction)       │
└────────────────────────────────┬────────────────────────────────┘
                                 │ ▲  Bi-directional Events
                                 ▼ │  (WSS / WebSocket Protocol)
┌────────────────────────────────┴────────────────────────────────┐
│                   BACKEND API & WEBSOCKET SERVER                │
│                     (Node.js / Express / Fastify)               │
│  - JWT Authentication & Session Handlers                        │
│  - Room Management ('post:102', 'artisan:maya', 'user:4')       │
│  - Event Ingestion, Validation & Rate Limiting                  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ ▲
                 Pub/Sub Broker  │ │
                 (Redis / NATS)  │ │
                                 ▼ ▼
┌────────────────────────────────┴────────────────────────────────┐
│                   DATABASE & PERSISTENCE LAYER                  │
│                     (PostgreSQL / Supabase)                     │
│  - Core Tables: users, artisans, posts, comments, orders        │
│  - Write-Ahead Logging (WAL) & DB Change Events                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Real-Time Capabilities for Craftinator-v2

| Feature | Real-Time Need | Impact |
| :--- | :--- | :--- |
| **Community Feed Interactions** | Live Likes count sync, real-time incoming comments | Increases social engagement and eliminates manual feed refreshes |
| **Artisan Direct Chat** | 1-to-1 buyer-to-maker messaging, typing indicators, read receipts | Enhances personalized customer trust and artisan connection |
| **Live Handcrafted Inventory** | Live stock decrement for small artisan batches | Prevents overselling limited kiln/handloom drops and reduces cart abandonment |
| **Flash Studio Drops** | Real-time batch drops countdown and instant availability updates | Drives scarcity and excitement for exclusive collector items |
| **Notifications Center** | Instant order updates, restock alerts, mention notifications | Keeps users engaged in real-time |

---

## 3. Recommended Technology Stack Options

### Option A: Managed Serverless (Fastest Time-to-Market)
* **Backend & DB**: **Supabase** (PostgreSQL + built-in Realtime Engine + Auth).
* **Why**: Zero server maintenance, instant database change streams, enterprise-grade auth, and automated WebSocket channel management.

### Option B: Custom Node.js Microservice (Full Control)
* **API / WS Server**: **Node.js (Fastify or Express) + Socket.io**.
* **Pub/Sub & Cache**: **Redis** (for multi-instance message broker and socket session stores).
* **Database**: **PostgreSQL** with Prisma ORM or Drizzle.
* **Why**: Maximum flexibility for complex inventory reservation workflows and bespoke e-commerce logic.

---

## 4. Frontend Preparation: "Real-Time Ready" Design

To keep the frontend decoupled, UI components should never connect to raw WebSockets directly. Instead, they interact via **Custom React Hooks** and an **Event-Driven Service Layer**.

### Step 1: Real-Time Client Abstraction (`src/services/realtime/socketService.js`)
```javascript
class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.ws = null;
  }

  connect(url = import.meta.env.VITE_WS_URL) {
    if (this.ws) return;
    // When backend is deployed: this.ws = new WebSocket(url);
    console.log('[Realtime] Service initialized');
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  emit(event, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, payload }));
    } else {
      // Local fallback simulation until backend deployment
      this.listeners.get(event)?.forEach(cb => cb(payload));
    }
  }
}

export const socketService = new RealtimeService();
```

### Step 2: Declarative React Hooks (`src/hooks/useRealtimeFeed.js`)
```javascript
import { useEffect } from 'react';
import { socketService } from '../services/realtime/socketService';

export function useRealtimePostEvents(postId, onLikeUpdated, onNewComment) {
  useEffect(() => {
    const unsubLike = socketService.subscribe(`post:${postId}:like`, onLikeUpdated);
    const unsubComment = socketService.subscribe(`post:${postId}:comment`, onNewComment);

    return () => {
      unsubLike();
      unsubComment();
    };
  }, [postId, onLikeUpdated, onNewComment]);
}
```

### Step 3: Optimistic UI Updates
1. User interacts (e.g. Clicks Like or Sends Message).
2. UI updates immediately (0ms feedback).
3. Event is emitted across WebSocket to server.
4. Server acknowledges and broadcasts to subscribers; rollbacks occur gracefully on network failure.

---

## 5. Phased Implementation Plan

- [ ] **Phase 1 (Preparation)**: Create `src/services/realtime/` abstraction layer and mock pub/sub events.
- [ ] **Phase 2 (Community Events)**: Connect Likes counter and Comments stream to mock WebSocket emitter.
- [ ] **Phase 3 (Artisan Chat Scaffold)**: Implement message payload schemas (`senderId`, `receiverId`, `message`, `timestamp`).
- [ ] **Phase 4 (Backend Integration)**: Deploy backend server (Node.js/Socket.io or Supabase), configure environment variables (`VITE_WS_URL`), and switch from mock events to live sockets.
- [ ] **Phase 5 (Live Inventory Locks)**: Implement real-time stock reservations on checkout initiate.
