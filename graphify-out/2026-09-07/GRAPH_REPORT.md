# Graph Report - Craftinator-v2  (2026-09-07)

## Corpus Check
- 61 files · ~67,532 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 237 nodes · 382 edges · 18 communities (12 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9872c743`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useLanguage
- package.json
- ShopPage.jsx
- TrendingProducts.jsx
- Safe Feature Implementation Workflow
- i18n-sync.js
- Design Tokens (`src/index.css`)
- Example 1: New Feature Request Workflow
- 3. Development Guidelines & Conventions
- vercel.json
- CuratedCollections.jsx
- Graphify Cheat Sheet & Guide (Antigravity IDE)
- Craftinator-v2 Workspace Guidelines & Agent Instructions
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 57 edges
2. `Safe Feature Implementation Workflow` - 16 edges
3. `Example 1: New Feature Request Workflow` - 8 edges
4. `scripts` - 7 edges
5. `useBodyScrollLock()` - 7 edges
6. `Phase 2 — Create an Implementation Plan` - 7 edges
7. `products` - 6 edges
8. `3. Development Guidelines & Conventions` - 6 edges
9. `Design Tokens (`src/index.css`)` - 6 edges
10. `Error Investigation Mode` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AppContent()` --calls--> `useLanguage()`  [EXTRACTED]
  src/App.jsx → src/i18n/LanguageContext.jsx
- `BrandValues()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/BrandValues.jsx → src/i18n/LanguageContext.jsx
- `CartDrawer()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/CartDrawer.jsx → src/i18n/LanguageContext.jsx
- `CommunitySection()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/CommunitySection.jsx → src/i18n/LanguageContext.jsx
- `Hero()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/Hero copy.jsx → src/i18n/LanguageContext.jsx

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "useLanguage"
Cohesion: 0.11
Nodes (24): App(), AppContent(), ArtisanModal(), AuthModal(), CartDrawer(), Footer(), Header(), Hero() (+16 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (27): lucide-react, dependencies, lucide-react, react, react-dom, devDependencies, @types/react, @types/react-dom (+19 more)

### Community 2 - "ShopPage.jsx"
Cohesion: 0.09
Nodes (20): ArtisanCardSkeleton(), ArtisanDiscoveryBanner(), BrandValues(), CommunitySection(), Hero(), MeetMakers(), Newsletter(), PersonalizedDiscovery() (+12 more)

### Community 3 - "TrendingProducts.jsx"
Cohesion: 0.47
Nodes (3): ProductCard(), ProductCardSkeleton(), TrendingProducts()

### Community 4 - "Safe Feature Implementation Workflow"
Cohesion: 0.06
Nodes (35): 1. Files to Create, 2. Files to Modify, 3. Architecture / Flow, 4. Reuse Existing Code, 5. Dependencies, 6. Potential Issues / Assumptions, Approval Gate 1 (Mandatory Stop), Approval Gate 2 (Review Findings Stop) (+27 more)

### Community 5 - "i18n-sync.js"
Cohesion: 0.27
Nodes (9): __dirname, extractTranslationCalls(), __filename, humanizeKey(), rootDir, run(), scanFiles(), srcDir (+1 more)

### Community 6 - "Design Tokens (`src/index.css`)"
Cohesion: 0.10
Nodes (18): Color Palette Tokens, Craftinator-v2 Design Tokens & Styling Guidelines, Design Tokens (`src/index.css`), Elevation & Shadows, Layout Constraints, Philosophy, Radii, Styling Conventions (+10 more)

### Community 7 - "Example 1: New Feature Request Workflow"
Cohesion: 0.14
Nodes (13): 1. User Prompt, 1. User Prompt, 2. Diagnosis Protocol (Zero file changes), 2. Phase 1 — Project Understanding (Zero file changes), 3. Approval Gate (Stop), 3. Phase 2 — Implementation Plan, 4. Approval Gate 1 (Stop), 5. Implementation Phase (Only after "Approved" or "Implement it") (+5 more)

### Community 8 - "3. Development Guidelines & Conventions"
Cohesion: 0.20
Nodes (10): 1. Project Inspection Workflow ("Understand the Project"), 2. Core Architecture Summary, 3. Development Guidelines & Conventions, Adding New Routes / Pages, Adding or Modifying Data, Craftinator-v2 Project & Engineering Guide, Internationalization (i18n) & Adding New Pages / Components / Languages, Modal & Drawer Behavior (+2 more)

### Community 9 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, installCommand, outputDirectory, rewrites

### Community 13 - "Graphify Cheat Sheet & Guide (Antigravity IDE)"
Cohesion: 0.33
Nodes (5): 1. Important Commands & Use Cases, 2. Nayi Files/Folders Add Karne Ya Update Command Chalane Par:, 3. Iska Main Use Case Kya Hai?, Graphify Cheat Sheet & Guide (Antigravity IDE), Kya Koi Problem (Khatra) Ho Sakta Hai?

### Community 14 - "Craftinator-v2 Workspace Guidelines & Agent Instructions"
Cohesion: 0.50
Nodes (3): Available Skills, Core Architectural Rules & Standards, Craftinator-v2 Workspace Guidelines & Agent Instructions

## Knowledge Gaps
- **94 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+89 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 104 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `useLanguage` to `ShopPage.jsx`, `TrendingProducts.jsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `Craftinator-v2 Project & Engineering Guide` connect `3. Development Guidelines & Conventions` to `Design Tokens (`src/index.css`)`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useLanguage` be split into smaller, more focused modules?**
  _Cohesion score 0.1109936575052854 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `ShopPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09024390243902439 - nodes in this community are weakly interconnected._
- **Should `Safe Feature Implementation Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._