# Graph Report - Craftinator-v2  (2026-09-09)

## Corpus Check
- 99 files · ~82,117 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 283 nodes · 453 edges · 22 communities (12 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06d1846b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LanguageContext.jsx
- package.json
- sections/Testimonials.jsx
- useLanguage
- Safe Feature Implementation Workflow
- i18n-sync.js
- Design Tokens (`src/index.css`)
- Example 1: New Feature Request Workflow
- index.js
- vercel.json
- sections/CuratedCollections.jsx
- Graphify Cheat Sheet & Guide (Antigravity IDE)
- Craftinator-v2 Workspace Guidelines & Agent Instructions
- rules/graphify.md
- workflows/graphify.md
- overlays/MobileDrawer.jsx
- sections/ShopByMaterial.jsx
- sections/ShopByCategory.jsx
- sections/CommunitySection.jsx

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 59 edges
2. `Safe Feature Implementation Workflow` - 16 edges
3. `Example 1: New Feature Request Workflow` - 8 edges
4. `scripts` - 7 edges
5. `products` - 7 edges
6. `useBodyScrollLock()` - 7 edges
7. `Phase 2 — Create an Implementation Plan` - 7 edges
8. `3. Development Guidelines & Conventions` - 6 edges
9. `Design Tokens (`src/index.css`)` - 6 edges
10. `Error Investigation Mode` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AppContent()` --calls--> `useLanguage()`  [EXTRACTED]
  src/App.jsx → src/i18n/LanguageContext.jsx
- `StoryModal()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/overlays/StoryModal.jsx → src/i18n/LanguageContext.jsx
- `Hero()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/Hero copy.jsx → src/i18n/LanguageContext.jsx
- `ProductCard()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/cards/ProductCard.jsx → src/i18n/LanguageContext.jsx
- `Footer()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/layout/Footer.jsx → src/i18n/LanguageContext.jsx

## Import Cycles
- None detected.

## Communities (22 total, 7 thin omitted)

### Community 0 - "LanguageContext.jsx"
Cohesion: 0.09
Nodes (14): App(), AppContent(), Footer(), AuthModal(), CartDrawer(), ProductModal(), StoryModal(), ToastNotification() (+6 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (27): lucide-react, dependencies, lucide-react, react, react-dom, devDependencies, @types/react, @types/react-dom (+19 more)

### Community 3 - "useLanguage"
Cohesion: 0.09
Nodes (18): Hero(), BrandValues(), CommunitySection(), Hero(), MeetMakers(), Newsletter(), PersonalizedDiscovery(), SellerCTA() (+10 more)

### Community 4 - "Safe Feature Implementation Workflow"
Cohesion: 0.06
Nodes (35): 1. Files to Create, 2. Files to Modify, 3. Architecture / Flow, 4. Reuse Existing Code, 5. Dependencies, 6. Potential Issues / Assumptions, Approval Gate 1 (Mandatory Stop), Approval Gate 2 (Review Findings Stop) (+27 more)

### Community 5 - "i18n-sync.js"
Cohesion: 0.27
Nodes (9): __dirname, extractTranslationCalls(), __filename, humanizeKey(), rootDir, run(), scanFiles(), srcDir (+1 more)

### Community 6 - "Design Tokens (`src/index.css`)"
Cohesion: 0.06
Nodes (28): Color Palette Tokens, Craftinator-v2 Design Tokens & Styling Guidelines, Design Tokens (`src/index.css`), Elevation & Shadows, Layout Constraints, Philosophy, Radii, Styling Conventions (+20 more)

### Community 7 - "Example 1: New Feature Request Workflow"
Cohesion: 0.14
Nodes (13): 1. User Prompt, 1. User Prompt, 2. Diagnosis Protocol (Zero file changes), 2. Phase 1 — Project Understanding (Zero file changes), 3. Approval Gate (Stop), 3. Phase 2 — Implementation Plan, 4. Approval Gate 1 (Stop), 5. Implementation Phase (Only after "Approved" or "Implement it") (+5 more)

### Community 8 - "index.js"
Cohesion: 0.09
Nodes (13): ProductCard(), ArtisanModal(), WishlistDrawer(), ArtisanDiscoveryBanner(), ProductAccordion(), ProductCardSkeleton(), ScrollToTop(), artisanShowcaseCards (+5 more)

### Community 9 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, installCommand, outputDirectory, rewrites

### Community 13 - "Graphify Cheat Sheet & Guide (Antigravity IDE)"
Cohesion: 0.33
Nodes (5): 1. Important Commands & Use Cases, 2. Nayi Files/Folders Add Karne Ya Update Command Chalane Par:, 3. Iska Main Use Case Kya Hai?, Graphify Cheat Sheet & Guide (Antigravity IDE), Kya Koi Problem (Khatra) Ho Sakta Hai?

### Community 14 - "Craftinator-v2 Workspace Guidelines & Agent Instructions"
Cohesion: 0.50
Nodes (3): Available Skills, Core Architectural Rules & Standards, Craftinator-v2 Workspace Guidelines & Agent Instructions

### Community 18 - "overlays/MobileDrawer.jsx"
Cohesion: 0.21
Nodes (5): Header(), MobileDrawer(), LanguageSelector(), LoadingScreen(), useBodyScrollLock()

## Knowledge Gaps
- **96 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 138 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `useLanguage` to `LanguageContext.jsx`, `sections/Testimonials.jsx`, `index.js`, `overlays/MobileDrawer.jsx`, `sections/ShopByCategory.jsx`, `sections/CommunitySection.jsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LanguageContext.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08602150537634409 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `useLanguage` be split into smaller, more focused modules?**
  _Cohesion score 0.09487179487179487 - nodes in this community are weakly interconnected._
- **Should `Safe Feature Implementation Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Design Tokens (`src/index.css`)` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._