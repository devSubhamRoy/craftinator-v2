# Craftinator-v2 Design Tokens & Styling Guidelines

## Philosophy
Craftinator utilizes an earthy, tactile, handcrafted aesthetic inspired by traditional artisan heritage combined with modern, clean editorial layouts.

---

## Design Tokens (`src/index.css`)

### Color Palette Tokens
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `--bg-primary` | `#FAF7F2` | Primary page background (warm linen/cream) |
| `--bg-secondary` | `#F3EFEA` | Secondary section background |
| `--bg-card` | `#FFFFFF` | Card & modal background surfaces |
| `--bg-dark` | `#1F1714` | High contrast sections / dark footer |
| `--bg-terracotta` | `#A85838` | Primary brand accent surface |
| `--bg-sage` | `#7A866A` | Secondary earthy accent surface |
| `--bg-warm-badge` | `#EFE8DF` | Neutral badge tag background |
| `--text-primary` | `#231815` | Main body & heading text (deep charcoal/espresso) |
| `--text-secondary` | `#5C4E46` | Secondary body text & descriptions |
| `--text-muted` | `#8C7B70` | Subtle captions, timestamps, meta info |
| `--text-light` | `#F7F4EE` | Light text on dark surfaces |
| `--text-terracotta` | `#A85838` | Terracotta colored text & links |
| `--border-warm` | `#E4DCD3` | Standard warm borders and dividers |
| `--border-light` | `#F0EAE1` | Subtle divider lines |
| `--border-dark` | `#3A2C27` | Borders on dark backgrounds |
| `--accent-terracotta` | `#A85838` | Primary button, active states, badges |
| `--accent-terracotta-hover` | `#91482C` | Hover state for terracotta buttons |
| `--accent-sage` | `#7A866A` | Earthy sage highlights |

### Typography Tokens
- **Editorial Serif**: `var(--font-serif)` -> `'Cormorant Garamond', Georgia, 'Times New Roman', serif`
  - Used for large headlines (`.heading-xl`, `.heading-lg`, `.heading-md`), hero titles, section titles.
- **Modern Sans**: `var(--font-sans)` -> `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Used for UI labels, navigation links, buttons, product titles, descriptions, and data tables.

### Elevation & Shadows
- `--shadow-sm`: `0 2px 8px rgba(35, 24, 21, 0.04)`
- `--shadow-md`: `0 8px 24px rgba(35, 24, 21, 0.08)`
- `--shadow-lg`: `0 16px 36px rgba(35, 24, 21, 0.12)`
- `--shadow-hover`: `0 12px 28px rgba(168, 88, 56, 0.15)`

### Radii
- `--radius-sm`: `6px`
- `--radius-md`: `12px`
- `--radius-lg`: `20px`
- `--radius-xl`: `28px`
- `--radius-full`: `9999px`

### Layout Constraints
- `--container-max`: `1320px` (standard container width)
- App header offset: `padding-top: 72px` (desktop), `padding-top: 60px` (mobile)

---

## Styling Conventions
1. **Vanilla CSS**: Do not introduce utility CSS frameworks (Tailwind, Bootstrap) unless explicitly requested.
2. **Dedicated CSS Files**: Every major component or page has its own CSS file in `src/styles/` (e.g. `src/styles/ProductCard.css` or inside `src/styles/Modals.css`), imported in `App.jsx`.
3. **Use CSS Variables**: Always reference `:root` tokens rather than hardcoded colors:
   - Use `var(--accent-terracotta)` instead of `#A85838`.
   - Use `var(--bg-primary)` instead of `#FAF7F2`.
   - Use `var(--font-serif)` for display titles and `var(--font-sans)` for body copy.
4. **Interactive States**: Every interactive button, card, and tab should have transition and hover micro-animations (`transition: var(--transition-fast)`).
