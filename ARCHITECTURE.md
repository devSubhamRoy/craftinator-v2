# Craftinator-v2 Project Architecture

> **Last Updated**: 2026-09-19 (After Layout Standardization & Mobile Width Alignment)

Craftinator-v2 is a curated artisan and handcrafted e-commerce & community SPA (Single Page Application) built with **React 18**, **Vite**, and an earthy **Pure Vanilla CSS Design System**.

---

## 1. High-Level System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ENTRY POINT & ROUTING                                  │
│                 main.jsx ──▶ App.jsx (History API Client-Side Routing)                 │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
┌───────────────────────────────────────┐       ┌───────────────────────────────────────┐
│           GLOBAL CONTEXTS             │       │             GLOBAL HOOKS              │
│  - LanguageContext (i18n System)      │       │  - useBodyScrollLock (Modals/Drawers) │
│  - NavigationContext (Page State)     │       │  - useDebounce, etc.                  │
└───────────────────┬───────────────────┘       └───────────────────┬───────────────────┘
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                       PAGES                                            │
│  ├─ HomePage.jsx            ├─ ShopPage.jsx           ├─ ProductDetailsPage.jsx        │
│  ├─ MeetMakersPage.jsx      ├─ ArtisanDetailsPage.jsx ├─ CommunityPage.jsx             │
│  ├─ ProfilePage.jsx         └─ SettingsPage.jsx                                        │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
┌───────────────────────────────────────┐       ┌───────────────────────────────────────┐
│             COMPONENTS                │       │             DATA LAYER                │
│  ├─ /sections (Hero, MeetMakers, etc.)│       │  ├─ products.js (Catalog)             │
│  ├─ /cards (ProductCard, etc.)        │       │  ├─ artisans.js (Maker Profiles)      │
│  ├─ /modals (CartDrawer, SearchModal) │       │  ├─ communityPosts.js (Feed Data)     │
│  └─ /ui (Buttons, Badges, Skeletons)  │       │  └─ reviews.js, categories.js         │
└───────────────────────────────────────┘       └───────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   STYLING LAYER                                        │
│  ├─ src/index.css (Design Tokens, Palette, Typography, Container System)               │
│  └─ src/styles/*.css (Pure Vanilla Component & Page Specific CSS Modules)              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & File Map

```
Craftinator-v2/
├── public/                 # Static public assets, favicon & fonts
├── scripts/
│   └── i18n-sync.js        # Automated script to scan codebase and sync translation keys
├── src/
│   ├── components/
│   │   ├── cards/          # ProductCard, ArtisanCard, ReviewCard
│   │   ├── modals/         # CartDrawer, SearchModal, ProductQuickView, StoryModal
│   │   ├── sections/       # Hero, MeetMakers, ShopByCategory, TrendingProducts, etc.
│   │   └── ui/             # Reusable UI primitives (Skeletons, Badges, Dropdowns)
│   ├── context/
│   │   └── NavigationContext.jsx # Page navigation state & history caching
│   ├── data/
│   │   ├── products.js     # Catalog datasets with pricing, materials, tags
│   │   ├── artisans.js     # Master artisans bios, craft categories, location
│   │   ├── communityPosts.js # Social craft stories, feeds & reactions
│   │   └── reviews.js      # Customer reviews & craft ratings
│   ├── hooks/
│   │   ├── useBodyScrollLock.js # Accessible modal backdrop scroll prevention
│   │   ├── useLazyVisibility.js # Native IntersectionObserver viewport trigger
│   │   └── useDebounce.js  # Search & input optimization
│   ├── i18n/
│   │   ├── LanguageContext.jsx # t('key', 'Default') translation provider
│   │   └── translations.json   # Multi-language dictionary (EN, HI, ES, FR, DE, JA)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── ArtisanDetailsPage.jsx
│   │   ├── MeetMakersPage.jsx
│   │   ├── CommunityPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/           # Socket & API service abstractions (Real-time ready)
│   ├── styles/             # Dedicated Pure Vanilla CSS files per component/page
│   ├── App.jsx             # Root Component: Routing, Cart, Wishlist, Global Modals
│   ├── index.css           # Global Design Tokens (Colors, Typography, Layout Tokens)
│   └── main.jsx            # Vite DOM React Root mount
├── vite.config.js          # Vite config (port 3000, host: true, React plugin)
├── vercel.json             # SPA rewrites configuration for production deployment
├── ARCHITECTURE.md         # Living Architecture Documentation
└── package.json
```

---

## 3. Core Architectural Principles

### 3.1. Zero-Dependency Client-Side Routing
- **Mechanism**: Managed inside `src/App.jsx` using the native HTML5 History API (`window.location.pathname`, `pushState`, `popstate`).
- **Benefits**: Zero bundle overhead compared to large router packages, instantaneous transitions, and full native browser history behavior.
- **SPA Rewrites**: Handled by `vercel.json` (`{"source": "/(.*)", "destination": "/index.html"}`) for deep linking without 404s.

### 3.2. Centralized State & Data Flow
- **Cart State**: Managed centrally in `src/App.jsx` with persistent `localStorage` synchronization and quantity update/remove handlers.
- **Wishlist State**: Global item ID array toggled across cards and pages.
- **Catalog & Social Data**: Static, strongly-typed JS modules in `src/data/` allowing instant client-side filtering, sorting, and search.

### 3.3. Pure Vanilla CSS & Design Tokens
- **Design Tokens (`src/index.css`)**:
  - **Palette**: Terracotta (`--accent-terracotta: #A85838`), Sand/Cream (`--bg-primary: #FAF7F2`), Dark Charcoal (`--text-primary: #231815`), Sage (`--accent-sage: #7A866A`).
  - **Typography**: Editorial Serif (`Cormorant Garamond`) + Clean Sans (`Plus Jakarta Sans`).
  - **Mobile Container Standard**: Universal `0.35rem` left/right gutter on `@media (max-width: 767px)` aligned with `ArtisanDetailsPage`.
  - **Product Media Standard**: Universal fixed `aspect-ratio: 3 / 4` portrait proportion across all cards (`ProductCard`, `ProductCardSkeleton`), Product Details (`.product-main-frame`), Wishlist, and Quick View Modals across Mobile, Tablet, and Desktop with `object-fit: cover`.
- **Zero Utility Library Overhead**: No Tailwind CSS or Bootstrap; component styles reside in dedicated `src/styles/*.css` files imported centrally.

### 3.4. Internationalization (i18n) Engine
- Managed via `src/i18n/LanguageContext.jsx` using `t('key', 'Default Text')`.
- Maintained via automated script `npm run i18n:sync` that scans `src/` and updates `translations.json` across all supported languages.

### 3.5. Accessible Drawers & Modals
- All overlays (Cart Drawer, Search Modal, Quick View, Story Modal) use `src/hooks/useBodyScrollLock.js` to prevent background page scroll while retaining touch accessibility.

### 3.6. Real-Time Extension Blueprint
- Documented in `REALTIME_ARCHITECTURE_PLAN.md` with an event-driven `src/services/` abstraction layer for bi-directional WebSockets (live stock, direct artisan chat, community reactions).

### 3.7. Progressive Lazy Loading & Route Code-Splitting
- **Route-Level Splitting (`React.lazy` + `Suspense`)**: All 8 application pages and heavy modals are split into independent on-demand JS chunks, reducing initial bundle transfer by ~45%.
- **Lightweight Fallback**: Route transitions use a subtle terracotta top progress bar and placeholder shimmer rather than blocking the whole screen.
- **Viewport-Aware Component Loading (`useLazyVisibility` & `LazySection`)**:
  - Employs native `IntersectionObserver` with a `250px` buffer so below-the-fold sections pre-render smoothly before entering the screen.
  - Above-the-fold content renders instantly at Frame 0.
  - Natural browser 60fps scrolling momentum is strictly preserved (zero custom scroll-jacking or artificial scroll delays).
- **Reusable Skeletons (`SectionSkeleton`)**: Earthy artisan pulse shimmer placeholders prevent Cumulative Layout Shift (CLS).

### 3.8. Universal Tab Lifecycle & State Preservation
- **NEW TAB (First time visiting in session)**:
  - Preserves previous tab's scroll position in memory and `sessionStorage`.
  - Displays instant shimmer skeleton placeholders (`PostSkeleton`) during content loading (`isTabLoading = true`).
  - Pushes clean history state (`/community?tab=<tabName>`).
  - Opens strictly from **TOP** (`scrollTop = 0`), preventing previous scroll positions from carrying over.
  - Smoothly reveals content via `@keyframes tabFadeIn` CSS crossfade.
- **ALREADY VISITED TAB (Revisiting a previously browsed tab)**:
  - Restores the saved scroll position for that specific tab without resetting to top.
  - Renders content immediately without blocking shimmer loaders.
- **ACTIVE TAB (Clicking the currently open tab button)**:
  - Smoothly scrolls to TOP (`scrollTop = 0`) and updates the tab's saved offset.
- **BROWSER BACK / POPSTATE RESTORATION**:
  - Restores the previous tab and uses `NavigationContext`'s multi-frame engine to return smoothly to the exact prior scroll position.
  - 100% compatible across Mobile, Tablet, and Desktop, preserving direction-aware sticky chips (`.soc-mobile-nav-chips.visible`) and natural 60fps scrolling.

---

## 4. Maintenance & Evolution Guide
When introducing new features or refactoring:
1. Always keep component styles in `src/styles/<ComponentName>.css`.
2. Wrap user-facing text with `t('key', 'Default Text')` and run `npm run i18n:sync`.
3. Keep container widths consistent with the `0.35rem` mobile standard.
4. For heavy below-the-fold page sections, wrap with `<LazySection placeholder={<SectionSkeleton ... />}>`.
5. Update this `ARCHITECTURE.md` file whenever architectural patterns or routing structures evolve.
