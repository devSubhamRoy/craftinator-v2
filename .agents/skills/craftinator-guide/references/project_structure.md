# Craftinator-v2 Project Structure & Components Reference

## Technology Stack
- **Framework**: React 18.2.0 (functional components with Hooks)
- **Bundler & Dev Server**: Vite 5.1.6 (`port: 3000`, `host: true`)
- **Icons**: `lucide-react` (v0.344.0)
- **Styling**: Pure Vanilla CSS with modular stylesheets and CSS custom properties
- **Routing**: Browser History API (`window.location.pathname`, `pushState`, `popstate`), rewrite rule in `vercel.json`
- **Backend / Database**: None (static in-memory JS datasets in `src/data/`, mock client-side authentication)
- **Testing**: None configured
- **Internationalization**: Custom React Context (`src/i18n/LanguageContext.jsx`) with multi-language dictionary (`src/i18n/translations.js`)

---

## Directory Organization

```
Craftinator-v2/
├── index.html                   # HTML entry with Google Fonts & hreflang SEO tags
├── package.json                 # Project scripts and dependencies
├── vite.config.js               # Dev server configuration
├── vercel.json                  # Single-page app routing rewrites
├── public/                      # Static assets, web manifest, favicons
├── logo/                        # Raw logo archives and icons
└── src/
    ├── main.jsx                 # Application DOM mount
    ├── App.jsx                  # Root state controller, routing, and modal host
    ├── index.css                # Global CSS reset, typography, and :root tokens
    ├── pages/                   # Main page views
    │   ├── HomePage.jsx         # Landing page
    │   └── ShopPage.jsx         # Marketplace page with infinite scroll & filters
    ├── components/              # 31 UI & section components
    ├── data/                    # In-memory mock datasets
    ├── hooks/                   # Custom utility hooks
    ├── i18n/                    # Localization system
    └── styles/                  # Dedicated CSS files for each component/page
```

---

## Key Components

### Global Layout & Shell
- **`Header.jsx`**: Sticky header with navigation links, logo, language selector, search trigger, wishlist/cart badge counts, and auth action buttons.
- **`Footer.jsx`**: Global footer with links, brand ethos, copyright, and social connections.
- **`MobileDrawer.jsx`**: Responsive mobile drawer for navigation and language selection.
- **`ScrollToTop.jsx`**: Floating scroll-to-top button with smooth scroll behavior.
- **`ToastNotification.jsx`**: Global auto-dismissing toast messages.

### Product & Marketplace
- **`ProductCard.jsx`**: Reusable product card with image, price, artisan name, rating, quick-add button, and wishlist toggle.
- **`ProductCardSkeleton.jsx`**: Shimmer loading placeholder for products.
- **`ProductModal.jsx`**: Modal overlay displaying complete product details, dimensions, materials, and quantity selector.
- **`ShopHero.jsx`**: Hero banner for the shop page with promotional message and action buttons.
- **`ShopByCategory.jsx`**: Horizontal category slider.
- **`ShopByMaterial.jsx`**: Material-based product discovery grid.
- **`TrendingProducts.jsx`**: Curated trending product grid for the homepage.
- **`PersonalizedDiscovery.jsx`**: Aesthetic style-based discovery filter.

### Artisan & Community
- **`MeetMakers.jsx`**: Artisan showcase section.
- **`ArtisanModal.jsx`**: Detailed artisan bio, studio images, experience, and craft philosophy.
- **`ArtisanCardSkeleton.jsx`**: Shimmer skeleton for artisan cards.
- **`ArtisanDiscoveryBanner.jsx`**: Featured artisan callout banner.
- **`CommunitySection.jsx`**: Community story and maker feed.
- **`StoryBanner.jsx` / `StoryModal.jsx`**: Cultural heritage storytelling banner and modal.
- **`SellerCTA.jsx`**: Call-to-action for onboarding new craftspeople.
- **`Testimonials.jsx`**: Customer reviews and testimonials.
- **`Newsletter.jsx`**: Email subscription banner.

### Drawers & Modals
- **`CartDrawer.jsx`**: Slide-in cart drawer with line item quantities, subtotal calculation, and checkout CTA.
- **`WishlistDrawer.jsx`**: Slide-in saved items drawer.
- **`AuthModal.jsx`**: Tabbed Login / Sign-up dialog with client-side form handling.

---

## Datasets (`src/data/`)
- **`products.js`**: Complete catalogue with prices (INR), categories, artisan associations, ratings, stock, tags, materials, and Unsplash images.
- **`artisans.js`**: Artisan profiles with biographies, specialties, locations, experience, and studio imagery.
- **`categories.js`**: Product category classifications.
- **`materials.js`**: Raw materials used in craft items (Ceramic, Teak, Silver, Linen, etc.).
- **`communityPosts.js`**: Community maker feed entries.
- **`shopCollections.js`**: Curated collection taxonomy.
- **`testimonials.js`**: Customer reviews.
