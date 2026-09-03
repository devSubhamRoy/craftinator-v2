import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { products } from '../data/products';
import { artisans } from '../data/artisans';
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Search, X, ArrowUpDown, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

/* Shop Page Specific Components */
import ShopHero from '../components/ShopHero';
import BrandValues from '../components/BrandValues';
import ShopByCategory from '../components/ShopByCategory';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ArtisanDiscoveryBanner from '../components/ArtisanDiscoveryBanner';
import ShopByMaterial from '../components/ShopByMaterial';
import PersonalizedDiscovery from '../components/PersonalizedDiscovery';
import SellerCTA from '../components/SellerCTA';
import Newsletter from '../components/Newsletter';

export default function ShopPage({
  wishlist,
  onToggleWishlist,
  onOpenProductModal,
  onAddToCart,
  onOpenArtisanModal,
  onNavigateHome
}) {
  const { t } = useLanguage();

  /* State Management */
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  /* -------------------------------------------------------------
     Direct Infinite Scroll Architecture:
     - 12 products per page chunk
     - Skeleton shimmer cards on scroll & filter transitions
     ------------------------------------------------------------- */
  const PAGE_SIZE = 12;

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const sentinelRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  isLoadingMoreRef.current = isLoadingMore;

  const filterDrawerRef = useRef(null);
  const filterBackdropRef = useRef(null);

  useBodyScrollLock(isFilterDrawerOpen, {
    containerRef: filterDrawerRef,
    backdropRef: filterBackdropRef,
    onClose: () => setIsFilterDrawerOpen(false),
  });

  const categories = [
    'All',
    'Pottery & Ceramics',
    'Jewelry',
    'Home & Living',
    'Woodcraft',
    'Textiles',
    'Art & Prints',
    'Candles',
    'Handmade Gifts'
  ];

  /* Filter and Sort Logic */
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Material Filter
    if (selectedMaterial !== 'All') {
      result = result.filter(p =>
        p.materials && p.materials.some(m => m.toLowerCase().includes(selectedMaterial.toLowerCase()))
      );
    }

    // Style Filter
    if (selectedStyle !== 'All') {
      result = result.filter(p => p.styleTag === selectedStyle);
    }

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.artisan.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [selectedCategory, selectedMaterial, selectedStyle, searchQuery, sortBy]);

  /* Total matching products after filters and sorting */
  const totalFilteredCount = processedProducts.length;

  /* Data visible in DOM */
  const visibleProducts = useMemo(() => {
    return processedProducts.slice(0, Math.min(visibleCount, totalFilteredCount));
  }, [processedProducts, visibleCount, totalFilteredCount]);

  const hasMore = visibleProducts.length < totalFilteredCount;

  /* Reset infinite scroll state when filters or sort order change */
  useEffect(() => {
    setIsFilterLoading(true);
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);

    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedMaterial, selectedStyle, searchQuery, sortBy]);

  /* Progressive batch loading handler with skeleton cards */
  const loadNextRecords = useCallback(() => {
    if (isLoadingMoreRef.current || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, totalFilteredCount));
      setIsLoadingMore(false);
    }, 550);
  }, [hasMore, totalFilteredCount]);

  /* IntersectionObserver sentinel near the bottom of list */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMoreRef.current) {
          loadNextRecords();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Trigger smoothly as user approaches bottom
        threshold: 0.05,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadNextRecords]);

  const handleCategorySelect = (cat) => {
    let catName = typeof cat === 'object' ? cat.name : cat;
    if (catName.includes('Pottery') || catName.includes('Ceramics')) catName = 'Pottery & Ceramics';
    else if (catName.includes('Jewelry')) catName = 'Jewelry';
    else if (catName.includes('Candles')) catName = 'Candles';
    else if (catName.includes('Woodcraft')) catName = 'Woodcraft';
    else if (catName.includes('Textiles') || catName.includes('Woven')) catName = 'Textiles';

    setSelectedCategory(catName);
    const el = document.getElementById('explore-all-products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMaterialSelect = (matName) => {
    setSelectedMaterial(matName);
    const el = document.getElementById('explore-all-products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    const el = document.getElementById('explore-all-products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setSelectedStyle('All');
    setSearchQuery('');
    setSortBy('recommended');
  };

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) +
    (selectedMaterial !== 'All' ? 1 : 0) +
    (selectedStyle !== 'All' ? 1 : 0) +
    (searchQuery !== '' ? 1 : 0);

  return (
    <div className="shop-page-root">
      
      {/* 1. Shop Hero */}
      <ShopHero onNavigateHome={onNavigateHome} />

      {/* 2. Brand Value Strip (Same as Homepage) */}
      <BrandValues />

      {/* 3. Shop by Category (3-Photo Split Collage Cards Carousel) */}
      <ShopByCategory onSelectCategory={handleCategorySelect} />

      {/* 3. All Handmade Products (Primary Marketplace Section) */}
      <section className="shop-all-products-section" id="explore-all-products">
        <div className="container">
          
          {/* Section Header */}
          <div className="shop-products-header">
            <div className="shop-header-left">
              <h2 className="heading-lg">Explore All Handmade</h2>
              <p className="paragraph-lg">
                {processedProducts.length} handcrafted pieces from independent makers.
              </p>
            </div>

            {/* Controls Bar: Filter Button (Left) & Sort Dropdown (Right) */}
            <div className="shop-controls-bar">
              <button
                className={`shop-filter-trigger-btn ${activeFilterCount > 0 ? 'active' : ''}`}
                onClick={() => setIsFilterDrawerOpen(true)}
                aria-label="Filter products"
              >
                <SlidersHorizontal size={16} />
                <span>Filter</span>
                {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
              </button>

              <div className="shop-sort-wrapper">
                <label htmlFor="shop-sort-select" className="sort-label">Sort By:</label>
                <div className="sort-select-container">
                  <ArrowUpDown size={14} className="sort-prefix-icon" />
                  <select
                    id="shop-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="shop-sort-select"
                    aria-label="Sort products"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Additions</option>
                  </select>
                  <ChevronDown size={14} className="select-arrow" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {activeFilterCount > 0 && (
            <div className="active-filters-strip">
              <span className="active-filters-label">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="filter-pill">
                  Category: {selectedCategory}
                  <X size={14} onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedMaterial !== 'All' && (
                <span className="filter-pill">
                  Material: {selectedMaterial}
                  <X size={14} onClick={() => setSelectedMaterial('All')} />
                </span>
              )}
              {selectedStyle !== 'All' && (
                <span className="filter-pill">
                  Style: {selectedStyle}
                  <X size={14} onClick={() => setSelectedStyle('All')} />
                </span>
              )}
              {searchQuery && (
                <span className="filter-pill">
                  Search: "{searchQuery}"
                  <X size={14} onClick={() => setSearchQuery('')} />
                </span>
              )}
              <button className="clear-all-btn" onClick={resetAllFilters}>
                Clear All
              </button>
            </div>
          )}

          {/* Primary Product Grid with Skeleton Loading States */}
          {isFilterLoading ? (
            <div className="product-grid shop-product-grid" aria-label="Loading products">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={`filter-skeleton-${idx}`} />
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <>
              <div className="product-grid shop-product-grid">
                {visibleProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={isWishlisted}
                      onToggleWishlist={onToggleWishlist}
                      onOpenProductModal={onOpenProductModal}
                      onAddToCart={onAddToCart}
                    />
                  );
                })}

                {/* Skeleton Cards Appended Seamlessly During Infinite Scroll Loading */}
                {isLoadingMore && (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <ProductCardSkeleton key={`scroll-skeleton-${idx}`} />
                  ))
                )}
              </div>

              {/* Infinite Scroll Sentinel Element */}
              <div ref={sentinelRef} className="infinite-scroll-sentinel" aria-hidden="true" />

              {/* Small Unobtrusive Loading Indicator & Load More Action */}
              {isLoadingMore ? (
                <div className="infinite-loading-indicator" role="status" aria-live="polite">
                  <Loader2 size={19} className="infinite-spinner" />
                  <span>Loading more Pieces...</span>
                </div>
              ) : hasMore && (
                <div className="text-center" style={{ marginTop: '1.75rem', marginBottom: '1.25rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={loadNextRecords}
                    style={{ minWidth: '240px', padding: '0.75rem 1.75rem', cursor: 'pointer' }}
                  >
                    Load More Pieces ({totalFilteredCount - visibleProducts.length} remaining)
                  </button>
                </div>
              )}

              {/* Natural End of Catalog Indicator */}
              {!hasMore && visibleProducts.length > 0 && (
                <div className="infinite-end-indicator">
                  <span className="end-divider-line" />
                  <span className="end-badge">
                    You've viewed all {totalFilteredCount} handcrafted pieces
                  </span>
                  <span className="end-divider-line" />
                </div>
              )}
            </>
          ) : (
            <div className="shop-no-results text-center">
              <h3>No handmade items found</h3>
              <p>Try adjusting your category filter, material search, or sorting options.</p>
              <button className="btn btn-primary" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 5. Artisan Discovery Banner */}
      <ArtisanDiscoveryBanner onOpenArtisan={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])} />

      {/* 6. Trending Now Section */}
      <section className="shop-trending-section">
        <div className="container">
          <div className="shop-trending-header">
            <h2 className="heading-md">Trending Now</h2>
            <div className="trending-badges-strip">
              <span className="badge badge-terracotta">Community Pick</span>
              <span className="badge badge-sage">Trending</span>
              <span className="badge">Bestseller</span>
            </div>
          </div>

          <div className="product-grid shop-trending-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onOpenProductModal={onOpenProductModal}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Shop by Material */}
      <ShopByMaterial onSelectMaterial={handleMaterialSelect} />

      {/* 8. Personalized Discovery */}
      <PersonalizedDiscovery onFilterByStyle={handleStyleSelect} />

      {/* 9. Seller CTA */}
      <SellerCTA onStartSelling={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])} />

      {/* 10. Newsletter */}
      <Newsletter onSubscribe={() => {}} />

      {/* Mobile / Desktop Filter Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div
          ref={filterBackdropRef}
          className="filter-drawer-backdrop"
          onClick={() => setIsFilterDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={filterDrawerRef}
            className="filter-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-drawer-header">
              <h3>Filter Products</h3>
              <button className="filter-drawer-close" onClick={() => setIsFilterDrawerOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            <div className="filter-drawer-body">
              {/* Category Filter */}
              <div className="filter-group">
                <label className="filter-group-title">Category</label>
                <div className="filter-options-grid">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`filter-option-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Tag Filter */}
              <div className="filter-group">
                <label className="filter-group-title">Style</label>
                <div className="filter-options-grid">
                  {['All', 'Minimal', 'Rustic', 'Bohemian', 'Contemporary', 'Statement', 'Nature Product'].map(style => (
                    <button
                      key={style}
                      className={`filter-option-btn ${selectedStyle === style ? 'active' : ''}`}
                      onClick={() => setSelectedStyle(style)}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Query Filter */}
              <div className="filter-group">
                <label className="filter-group-title">Search Keywords</label>
                <div className="filter-search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search pottery, jewelry, leather..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Annotated Stubs for Backend API Filters */}
              <div className="filter-group filter-stub-group">
                <label className="filter-group-title">Price Range</label>
                <p className="stub-note">Requires backend/API support</p>
              </div>

              <div className="filter-group filter-stub-group">
                <label className="filter-group-title">Artisan Location</label>
                <p className="stub-note">Requires backend/API support</p>
              </div>
            </div>

            <div className="filter-drawer-footer">
              <button className="btn btn-secondary" onClick={resetAllFilters}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={() => setIsFilterDrawerOpen(false)}>
                Apply ({processedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
