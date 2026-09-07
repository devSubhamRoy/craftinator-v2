import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { products } from '../data/products';
import { artisans } from '../data/artisans';
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Search, X, ArrowUpDown, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

/* Shop Page Specific Components */
import ShopHero from '../components/ShopHero';
import BrandValues from '../components/BrandValues';
import ShopByCategory from '../components/ShopByCategory';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ArtisanDiscoveryBanner from '../components/ArtisanDiscoveryBanner';
import MeetMakers from '../components/MeetMakers';
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

  /* Trending Section Infinite Horizontal Row State */
  const [trendingTab, setTrendingTab] = useState('All');
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [isTrendingLoadingMore, setIsTrendingLoadingMore] = useState(false);
  const [visibleTrendingCount, setVisibleTrendingCount] = useState(12);
  const trendingTrackRef = useRef(null);

  /* Initial mount skeleton shimmer effect for trending section */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTrendingLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const trendingTabs = [
    { id: 'All', label: t('tab_all_trending') },
    { id: 'Community Pick', label: t('tab_community_pick') },
    { id: 'Trending', label: t('tab_trending') },
    { id: 'Bestseller', label: t('tab_top_sellers') },
    { id: 'Staff Pick', label: t('tab_staff_picks') }
  ];

  const handleTrendingTabChange = (tabId) => {
    if (tabId === trendingTab) return;
    setIsTrendingLoading(true);
    setTrendingTab(tabId);
    setVisibleTrendingCount(12);
    if (trendingTrackRef.current) {
      trendingTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      setIsTrendingLoading(false);
    }, 350);
  };

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

  /* All Matching Trending Products for active tab */
  const allMatchingTrending = useMemo(() => {
    if (trendingTab === 'All') {
      return products.filter(p => p.isTrending);
    }
    if (trendingTab === 'Community Pick') {
      return products.filter(p => p.badge === 'Community Pick');
    }
    if (trendingTab === 'Trending') {
      return products.filter(p => p.badge === 'Trending' || (p.isTrending && p.rating >= 4.9));
    }
    if (trendingTab === 'Bestseller') {
      return products.filter(p => p.badge === 'Top Seller' || p.badge === 'Bestseller');
    }
    if (trendingTab === 'Staff Pick') {
      return products.filter(p => p.badge === 'Staff Pick' || p.badge === 'Masterwork' || p.badge === 'Artisan Original');
    }
    return products.filter(p => p.isTrending);
  }, [trendingTab]);

  /* Infinite Horizontal List: Loads items progressively and loops so right scrolling never ends */
  const trendingProductsList = useMemo(() => {
    if (allMatchingTrending.length === 0) return [];
    const base = allMatchingTrending.slice(0, visibleTrendingCount);
    // Duplicate items if count is small so horizontal scroll track is rich and continuous
    return base.length < 8 ? [...base, ...base, ...base] : base;
  }, [allMatchingTrending, visibleTrendingCount]);

  /* Infinite Right Scroll Detection with Progressive Skeleton Loading */
  const handleTrendingTrackScroll = () => {
    const el = trendingTrackRef.current;
    if (!el || isTrendingLoadingMore) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 360) {
      if (visibleTrendingCount < allMatchingTrending.length) {
        setIsTrendingLoadingMore(true);
        setTimeout(() => {
          setVisibleTrendingCount(prev => Math.min(prev + 6, allMatchingTrending.length));
          setIsTrendingLoadingMore(false);
        }, 400);
      }
    }
  };

  const handleScrollTrendingLeft = () => {
    if (trendingTrackRef.current) {
      trendingTrackRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleScrollTrendingRight = () => {
    if (trendingTrackRef.current) {
      trendingTrackRef.current.scrollBy({ left: 340, behavior: 'smooth' });
      const el = trendingTrackRef.current;
      if (el && el.scrollLeft + el.clientWidth >= el.scrollWidth - 500 && !isTrendingLoadingMore) {
        if (visibleTrendingCount < allMatchingTrending.length) {
          setIsTrendingLoadingMore(true);
          setTimeout(() => {
            setVisibleTrendingCount(prev => Math.min(prev + 6, allMatchingTrending.length));
            setIsTrendingLoadingMore(false);
          }, 400);
        }
      }
    }
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
      {/* <BrandValues /> */}

      {/* 3. Shop by Category (3-Photo Split Collage Cards Carousel) */}
      <ShopByCategory onSelectCategory={handleCategorySelect} />

      {/* 3. All Handmade Products (Primary Marketplace Section) */}
      <section className="shop-all-products-section" id="explore-all-products">
        <div className="container">
          
          {/* Section Header */}
          <div className="shop-products-header">
            <div className="shop-header-left">
              <h2 className="heading-lg">{t('shop_explore_title')}</h2>
              <p className="paragraph-lg">
                {processedProducts.length} {t('shop_pieces_count')}
              </p>
            </div>

            {/* Controls Bar: Filter Button (Left) & Sort Dropdown (Right) */}
            <div className="shop-controls-bar">
              <button
                className={`shop-filter-trigger-btn ${activeFilterCount > 0 ? 'active' : ''}`}
                onClick={() => setIsFilterDrawerOpen(true)}
                aria-label={t('shop_filter_btn')}
              >
                <SlidersHorizontal size={16} />
                <span>{t('shop_filter_btn')}</span>
                {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
              </button>

              <div className="shop-sort-wrapper">
                <label htmlFor="shop-sort-select" className="sort-label">{t('shop_sort_by')}</label>
                <div className="sort-select-container">
                  <ArrowUpDown size={14} className="sort-prefix-icon" />
                  <select
                    id="shop-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="shop-sort-select"
                    aria-label={t('shop_sort_by')}
                  >
                    <option value="recommended">{t('sort_recommended')}</option>
                    <option value="price-low">{t('sort_price_low')}</option>
                    <option value="price-high">{t('sort_price_high')}</option>
                    <option value="rating">{t('sort_rating')}</option>
                    <option value="newest">{t('sort_newest')}</option>
                  </select>
                  <ChevronDown size={14} className="select-arrow" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {activeFilterCount > 0 && (
            <div className="active-filters-strip">
              <span className="active-filters-label">{t('shop_active_filters')}</span>
              {selectedCategory !== 'All' && (
                <span className="filter-pill">
                  {t('shop_filter_cat_label')} {selectedCategory}
                  <X size={14} onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedMaterial !== 'All' && (
                <span className="filter-pill">
                  {t('shop_filter_mat_label')} {selectedMaterial}
                  <X size={14} onClick={() => setSelectedMaterial('All')} />
                </span>
              )}
              {selectedStyle !== 'All' && (
                <span className="filter-pill">
                  {t('shop_filter_style_label')} {selectedStyle}
                  <X size={14} onClick={() => setSelectedStyle('All')} />
                </span>
              )}
              {searchQuery && (
                <span className="filter-pill">
                  {t('shop_filter_search_label')} "{searchQuery}"
                  <X size={14} onClick={() => setSearchQuery('')} />
                </span>
              )}
              <button className="clear-all-btn" onClick={resetAllFilters}>
                {t('shop_clear_all')}
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
                    {t('shop_showing_all')} ({totalFilteredCount})
                  </span>
                  <span className="end-divider-line" />
                </div>
              )}
            </>
          ) : (
            <div className="shop-no-results text-center">
              <h3>{t('shop_no_products')}</h3>
              <p>{t('shop_reset_filters')}</p>
              <button className="btn btn-primary" onClick={resetAllFilters}>
                {t('shop_reset_filters')}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 5. Artisan Discovery Banner */}
      <ArtisanDiscoveryBanner onOpenArtisan={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])} />

      {/* 6. Trending Now Section (Single-Row Infinite Horizontal Scrolling) */}
      <section className="shop-trending-section" id="shop-trending">
        <div className="container">
          
          {/* Trending Header with Eyebrow, Title, Filter Strip & Nav Controls */}
          <div className="shop-trending-header">
            <div className="shop-trending-title-group">
              <span className="eyebrow">{t('story_badge')}</span>
              <h2 className="heading-lg">{t('shop_trending_title')}</h2>
              <p className="paragraph-lg shop-trending-subtitle">
                {t('shop_trending_subtitle')}
              </p>
            </div>

            {/* Filter Tabs & Quick Nav Arrows */}
            <div className="shop-trending-controls">
              <div className="trending-badges-strip" role="tablist" aria-label="Filter trending products">
                {trendingTabs.map((tab) => {
                  const isActive = trendingTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      className={`trending-tab-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleTrendingTabChange(tab.id)}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Single-Row Horizontal Infinite Scrolling Track Wrapper */}
          <div className="trending-horizontal-row-wrapper">
            {/* Left Edge Floating Arrow for Desktop Quick Scroll */}
            <button
              type="button"
              className="trending-side-arrow trending-side-arrow-left"
              onClick={handleScrollTrendingLeft}
              aria-label="Scroll trending items left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Single Continuous Row Track (No wrap, Left-Right Infinite Scroll) */}
            <div
              ref={trendingTrackRef}
              className="trending-horizontal-track"
              onScroll={handleTrendingTrackScroll}
            >
              {isTrendingLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={`trending-row-skeleton-${idx}`} className="trending-row-item">
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : trendingProductsList.length > 0 ? (
                <>
                  {trendingProductsList.map((product, idx) => (
                    <div key={`${product.id}-trending-${idx}`} className="trending-row-item">
                      <ProductCard
                        product={product}
                        isWishlisted={wishlist.includes(product.id)}
                        onToggleWishlist={onToggleWishlist}
                        onOpenProductModal={onOpenProductModal}
                        onAddToCart={onAddToCart}
                      />
                    </div>
                  ))}
                  {/* Appending skeleton cards while horizontally loading more */}
                  {isTrendingLoadingMore && (
                    Array.from({ length: 2 }).map((_, idx) => (
                      <div key={`trending-more-skeleton-${idx}`} className="trending-row-item trending-skeleton-item">
                        <ProductCardSkeleton />
                      </div>
                    ))
                  )}
                </>
              ) : (
                <div className="shop-no-results text-center" style={{ width: '100%', padding: '2rem 0' }}>
                  <p>No trending items found in this category.</p>
                </div>
              )}
            </div>

            {/* Right Edge Floating Arrow for Desktop Quick Scroll */}
            <button
              type="button"
              className="trending-side-arrow trending-side-arrow-right"
              onClick={handleScrollTrendingRight}
              aria-label="Scroll trending items right"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Bottom Exploration Link */}
          {/* <div className="shop-trending-footer text-center">
            <button
              className="btn btn-secondary shop-trending-view-all-btn"
              onClick={() => {
                const el = document.getElementById('explore-all-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore All {products.length} Handcrafted Pieces</span>
              <ArrowRight size={17} />
            </button>
          </div> */}

        </div>
      </section>

      {/* 7. Meet the Makers / Artisans */}
      <MeetMakers onOpenArtisanModal={onOpenArtisanModal} />

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
              <h3>{t('shop_filter_drawer_title')}</h3>
              <button className="filter-drawer-close" onClick={() => setIsFilterDrawerOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            <div className="filter-drawer-body">
              {/* Category Filter */}
              <div className="filter-group">
                <label className="filter-group-title">{t('shop_filter_drawer_cat')}</label>
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
                <label className="filter-group-title">{t('shop_filter_drawer_style')}</label>
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
                <label className="filter-group-title">{t('shop_filter_drawer_search')}</label>
                <div className="filter-search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder={t('shop_filter_drawer_search_ph')}
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
                {t('shop_filter_drawer_reset')}
              </button>
              <button className="btn btn-primary" onClick={() => setIsFilterDrawerOpen(false)}>
                {t('shop_filter_drawer_apply')} ({processedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
