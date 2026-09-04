---
name: craftinator-guide
description: >-
  Comprehensive architecture, structure, and step-by-step project inspection and development
  guide for Craftinator-v2. Use when onboarding, inspecting project structure, developing new
  features, creating components, modifying routing, or adhering to Craftinator's design tokens.
---

# Craftinator-v2 Project & Engineering Guide

This skill provides the authoritative reference for the architecture, project structure, conventions, and inspection runbook for **Craftinator-v2** (a curated artisan e-commerce platform).

---

## 1. Project Inspection Workflow ("Understand the Project")

When performing initial project discovery or asked to inspect the codebase before making changes, follow these strict rules:

### Rules:
- **Do not modify any files** during the inspection phase.
- Perform a comprehensive structural audit addressing all 9 dimensions:
  1. **Framework & Technologies**: Verify React version, bundler (Vite), icon library (`lucide-react`), module system.
  2. **Folder & Component Structure**: Audit `src/components/`, `src/pages/`, `src/data/`, `src/hooks/`, `src/i18n/`, and `src/styles/`.
  3. **Routing Mechanism**: Verify how client routes are resolved (custom browser History API in `App.jsx` vs react-router), pushState handlers, and `vercel.json` rewrites.
  4. **Authentication Architecture**: Check whether auth is real or simulated mock modal (`AuthModal.jsx`).
  5. **UI Components & Styling**: Verify styling system (Vanilla CSS in `src/styles/`, tokens in `src/index.css`, Google Fonts).
  6. **API / Backend**: Confirm if a backend exists or if data is read statically from `src/data/`.
  7. **Database**: Check database presence, ORM, or persistence (e.g. `localStorage`).
  8. **Testing Setup**: Check for test runners, test files, and test scripts in `package.json`.
  9. **Configuration Files**: Audit `package.json`, `vite.config.js`, `vercel.json`, and `index.html`.
- Deliver a concise summary of findings to the user before touching any code.

---

## 2. Core Architecture Summary

| Component | Current Implementation | Details |
| :--- | :--- | :--- |
| **Framework** | React 18.2.0 | Pure functional components with hooks |
| **Bundler** | Vite 5.1.6 | Port 3000, React plugin, ES Modules |
| **Routing** | Custom Browser History API | `handleNavigate(path)` + `window.history.pushState` in `App.jsx` |
| **Styling** | Vanilla CSS + CSS Variables | Defined in `src/index.css`, component styles in `src/styles/` |
| **Data Layer** | Static Mock Datasets | Located in `src/data/` (`products.js`, `artisans.js`, etc.) |
| **State** | React Component State | Cart, wishlist, modal states centralized in `App.jsx` |
| **i18n** | `LanguageContext` + `translations.js` | Supports 15+ languages via `t('key')` |
| **Auth** | Simulated Client-Side Modal | `AuthModal.jsx` displays form and triggers toast notifications |
| **Backend / DB** | None | No backend endpoints, no SQL/NoSQL database |

For deeper file-by-file component breakdowns, consult [Project Structure Reference](./references/project_structure.md).
For complete CSS variables, colors, and typography, consult [Design Tokens Reference](./references/design_tokens.md).

---

## 3. Development Guidelines & Conventions

### Styling Rules
- **Use Vanilla CSS**: Do not introduce utility frameworks like Tailwind unless explicitly instructed.
- **Reference CSS Tokens**: Always use CSS custom properties from `src/index.css` (e.g., `var(--accent-terracotta)`, `var(--bg-primary)`, `var(--font-serif)`).
- **Style Placement**: Place component-specific styles in `src/styles/<ComponentName>.css` and import in `src/App.jsx`.
- **Micro-interactions**: Use transitions (`var(--transition-fast)`) and hover states on buttons, cards, and links.

### Internationalization (i18n) & Adding New Pages / Components / Languages
- **Always use `t()` with fallback**: When creating or modifying components, wrap UI text with `const { t } = useLanguage();` and pass fallback text:
  ```jsx
  <h2>{t('my_new_section_title', 'My Section Title')}</h2>
  ```
- **Automatic Translation Sync**: To automatically register and propagate newly added keys across all 15 language dictionaries in `src/i18n/translations.js`, run:
  ```bash
  npm run i18n:sync
  ```
- **Add a Brand-New Language**: To add a new language with all 140+ keys automatically scaffolded, run:
  ```bash
  node scripts/i18n-sync.js --add-lang tr Turkish Türkçe ltr 🇹🇷
  ```
- **Audit Translation Coverage**:
  ```bash
  npm run i18n:check
  ```

### Adding New Routes / Pages
1. Create your page component in `src/pages/<PageName>.jsx`.
2. In `src/App.jsx`, add route detection in `currentPath` state:
   ```javascript
   const [currentPath, setCurrentPath] = useState(
     window.location.pathname === '/new-route' ? '/new-route' : ...
   );
   ```
3. Add the route branch inside `<main id="main-content">` in `src/App.jsx`.
4. Ensure `vercel.json` continues rewriting all paths to `/index.html`.

### Adding or Modifying Data
- Products are stored in `src/data/products.js`. Follow the schema:
  - `id`: unique kebab-case string
  - `name`: string
  - `artisan`: string
  - `artisanCity`: string
  - `price`: number (INR)
  - `rating`: number
  - `reviewsCount`: number
  - `badge`: string (e.g., 'Top Seller', 'Handmade', 'Trending')
  - `category`: string
  - `image`: valid Unsplash or local URL
  - `materials`: string array
  - `stock`: number
  - `styleTag`: string

### Modal & Drawer Behavior
- When implementing a drawer or modal, use the custom `useBodyScrollLock` hook:
  ```javascript
  import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
  useBodyScrollLock(isOpen, {
    containerRef: panelRef,
    backdropRef: backdropRef,
    onClose: handleClose
  });
  ```
- Always support `Escape` key close and background backdrop click dismiss.
