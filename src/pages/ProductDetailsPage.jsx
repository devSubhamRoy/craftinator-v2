import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  MapPin,
  Truck,
  RotateCcw,
  ShieldCheck,
  Leaf,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Check,
  Flame,
  Info
} from 'lucide-react';
import { products } from '../data/products';
import { artisans } from '../data/artisans';
import { editorialHeroCards } from '../data/editorialHeroes';
import { getProductReviews } from '../data/reviews';
import { useLanguage } from '../i18n/LanguageContext';

/* Reusable Components for Consistency */
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import BrandValues from '../components/BrandValues';
import Newsletter from '../components/Newsletter';

export default function ProductDetailsPage({
  productId,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onOpenArtisanModal,
  onOpenProductModal,
  onNavigate
}) {
  const { t } = useLanguage();

  // 1. Find Product & Maker
  const product = useMemo(() => {
    if (!productId) return products[0];
    const found = products.find((p) => p.id === productId);
    return found || products[0];
  }, [productId]);

  const maker = useMemo(() => {
    if (!product) return null;
    return artisans.find((a) => a.name === product.artisan) || null;
  }, [product]);

  // 2. Interactive States
  const [selectedImg, setSelectedImg] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'materials' | 'reviews'
  const [followingArtisanIds, setFollowingArtisanIds] = useState([]);
  const [makerSortBy, setMakerSortBy] = useState('recommended'); // 'recommended' | 'price-low' | 'price-high' | 'rating'

  // Pagination for Maker Products (Load More with skeleton loading)
  const INITIAL_MAKER_COUNT = 8;
  const [visibleMakerCount, setVisibleMakerCount] = useState(INITIAL_MAKER_COUNT);
  const [isMakerLoadingMore, setIsMakerLoadingMore] = useState(false);

  // Reset when viewing a different product
  useEffect(() => {
    if (product) {
      setSelectedImg(product.image);
      setQuantity(1);
      setActiveTab('description');
      setMakerSortBy('recommended');
      setVisibleMakerCount(INITIAL_MAKER_COUNT);
      setIsMakerLoadingMore(false);
    }
  }, [product?.id]);

  // Gallery thumbnails
  const thumbnails = useMemo(() => {
    if (!product) return [];
    const list = [product.image];
    if (maker?.workImage1) list.push(maker.workImage1);
    if (maker?.workImage2) list.push(maker.workImage2);
    if (maker?.studioImage) list.push(maker.studioImage);
    return list;
  }, [product, maker]);

  // 3. All Products Section (The Same Maker's Other Creations)
  const makerOtherProducts = useMemo(() => {
    if (!product) return [];
    const others = products.filter(
      (p) => p.artisan === product.artisan && p.id !== product.id
    );
    // If maker has fewer than 4 other pieces, supplement with matching pieces from the same artisan craft or city
    if (others.length < 4) {
      const supplementary = products.filter(
        (p) =>
          p.id !== product.id &&
          !others.some((o) => o.id === p.id) &&
          (p.artisanCity === product.artisanCity || p.category === product.category)
      );
      return [...others, ...supplementary].slice(0, 8);
    }
    return others;
  }, [product]);

  // Sorted maker products matching ShopPage sorting logic
  const sortedMakerProducts = useMemo(() => {
    let list = [...makerOtherProducts];
    if (makerSortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (makerSortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (makerSortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [makerOtherProducts, makerSortBy]);

  // Currently visible paginated maker products
  const visibleMakerProducts = useMemo(() => {
    return sortedMakerProducts.slice(0, visibleMakerCount);
  }, [sortedMakerProducts, visibleMakerCount]);

  // Handle Load More with realistic skeleton shimmer state
  const handleLoadMoreMakerProducts = () => {
    setIsMakerLoadingMore(true);
    setTimeout(() => {
      setVisibleMakerCount((prev) => prev + 8);
      setIsMakerLoadingMore(false);
    }, 600);
  };

  // 4. Related Products Section (Same Category & Style)
  const relatedCategoryProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.category === product.category && p.artisan !== product.artisan)
      .slice(0, 4);
  }, [product]);

  // 5. Related Artisans (Working in similar craft or region)
  const relatedArtisans = useMemo(() => {
    if (!product) return artisans.slice(0, 5);
    // Find artisans matching craft category keywords
    const categoryLower = product.category?.toLowerCase() || '';
    const matches = artisans.filter(
      (a) =>
        a.name !== product.artisan &&
        (categoryLower.includes('ceramic') && a.craft.toLowerCase().includes('ceramic') ||
         categoryLower.includes('pottery') && a.craft.toLowerCase().includes('potter') ||
         categoryLower.includes('wood') && a.craft.toLowerCase().includes('wood') ||
         categoryLower.includes('jewelry') && a.craft.toLowerCase().includes('jewelry') ||
         categoryLower.includes('textile') && a.craft.toLowerCase().includes('textile') ||
         categoryLower.includes('candle') && a.craft.toLowerCase().includes('chandler'))
    );
    if (matches.length >= 3) return matches;
    // Otherwise return next artisans from list
    return artisans.filter((a) => a.name !== product.artisan).slice(0, 5);
  }, [product]);

  // Reviews data retrieved dynamically by product ID (with maker/item fallback)
  const productReviewsList = useMemo(() => {
    return getProductReviews(product?.id, product);
  }, [product]);

  // Editorial Carousel scroll controls
  const heroSliderRef = useRef(null);
  const handleScrollHero = (dir) => {
    if (heroSliderRef.current) {
      const scrollAmount = heroSliderRef.current.clientWidth * 0.75;
      heroSliderRef.current.scrollBy({
        left: dir === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Artisans slider scroll controls
  const artisanSliderRef = useRef(null);
  const handleScrollArtisans = (dir) => {
    if (artisanSliderRef.current) {
      const scrollAmount = 300;
      artisanSliderRef.current.scrollBy({
        left: dir === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleToggleFollow = (e, artisanId) => {
    e.stopPropagation();
    setFollowingArtisanIds((prev) =>
      prev.includes(artisanId)
        ? prev.filter((id) => id !== artisanId)
        : [...prev, artisanId]
    );
  };

  const isWishlisted = wishlist.includes(product?.id);

  if (!product) return null;

  return (
    <div className="product-details-page">
      <div className="container">

        {/* 1. Breadcrumb Bar */}
        <div className="product-breadcrumb-bar">
          <nav className="product-breadcrumbs" aria-label="Breadcrumb navigation">
            <button
              type="button"
              className="breadcrumb-link"
              onClick={() => onNavigate && onNavigate('/')}
            >
              {t('nav_home', 'Home')}
            </button>
            <span className="breadcrumb-sep">/</span>
            <button
              type="button"
              className="breadcrumb-link"
              onClick={() => onNavigate && onNavigate('/shop')}
            >
              {t('nav_shop', 'Shop')}
            </button>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>

          <button
            type="button"
            className="btn-back-to-shop"
            onClick={() => onNavigate && onNavigate('/shop')}
          >
            <ArrowLeft size={16} />
            <span>{t('back_to_shop', 'Back to Catalog')}</span>
          </button>
        </div>

        {/* 1. Product Hero / Main Product Section */}
        <section className="product-showcase-grid">

          {/* Left Media Gallery */}
          <div className="product-media-column">
            <div className="product-main-frame">
              <img
                src={selectedImg || product.image}
                alt={product.name}
                className="product-main-img"
              />
              {product.badge && (
                <span className="product-detail-badge">{product.badge}</span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {thumbnails.length > 1 && (
              <div className="product-thumbnails-track" role="tablist">
                {thumbnails.map((imgUrl, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    type="button"
                    className={`product-thumb-btn ${
                      selectedImg === imgUrl ? 'active' : ''
                    }`}
                    onClick={() => setSelectedImg(imgUrl)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Information & Actions */}
          <div className="product-info-column">
            <div className="product-meta-pills">
              <span className="product-category-pill">{product.category}</span>
              {product.styleTag && (
                <span className="product-style-pill">{product.styleTag} Style</span>
              )}
            </div>

            <h1 className="product-page-title">{product.name}</h1>

            <div className="product-maker-row">
              <MapPin size={15} className="maker-city-icon" />
              <span>
                {t('crafted_in', 'Crafted in')} {product.artisanCity} {t('by', 'by')}{' '}
                <button
                  type="button"
                  className="maker-link-btn"
                  onClick={() => maker && onOpenArtisanModal && onOpenArtisanModal(maker)}
                >
                  {product.artisan}
                </button>
              </span>
            </div>

            <div className="product-rating-box">
              <div className="rating-stars-cluster">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#A85838" color="#A85838" />
                ))}
              </div>
              <span className="rating-score-badge">{product.rating}</span>
              <span className="rating-reviews-label">
                ({product.reviewsCount} {t('verified_reviews', 'verified reviews')})
              </span>
            </div>

            <div className="product-price-box">
              <span className="product-currency-price">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="product-tax-note">{t('tax_included', 'Inclusive of all taxes')}</span>
              <span className="product-stock-tag">
                {t('in_stock', 'In Stock')} ({product.stock} {t('units_left', 'units left')})
              </span>
            </div>

            <p className="product-hero-summary">{product.description}</p>

            {/* Stepper, Add to Cart, Wishlist */}
            <div className="product-actions-cluster">
              <div className="product-stepper-row">
                <div className="product-qty-selector">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-add-cart-main"
                  onClick={() => onAddToCart && onAddToCart(product, quantity)}
                >
                  <ShoppingBag size={18} />
                  <span>{t('add_to_cart', 'Add to Cart')}</span>
                </button>

                <button
                  type="button"
                  className={`btn-wishlist-circle ${isWishlisted ? 'active' : ''}`}
                  onClick={() => onToggleWishlist && onToggleWishlist(product.id)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={20} fill={isWishlisted ? '#A85838' : 'none'} />
                </button>
              </div>
            </div>

            {/* Artisan Trust Guarantees */}
            <div className="artisan-trust-grid">
              <div className="trust-item">
                <ShieldCheck size={18} className="trust-icon" />
                <span>{t('trust_100_handcrafted', '100% Verified Handcrafted')}</span>
              </div>
              <div className="trust-item">
                <Truck size={18} className="trust-icon" />
                <span>{t('trust_direct_shipping', 'Direct Studio Dispatch')}</span>
              </div>
              <div className="trust-item">
                <RotateCcw size={18} className="trust-icon" />
                <span>{t('trust_returns', '14-Day Artisan Return Guarantee')}</span>
              </div>
              <div className="trust-item">
                <Leaf size={18} className="trust-icon" />
                <span>{t('trust_eco_packaging', 'Plastic-Free Eco Packaging')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Product Information Tabs */}
        <section className="product-tabs-section">
          <div className="product-tabs-nav" role="tablist">
            <button
              type="button"
              className={`product-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
              role="tab"
              aria-selected={activeTab === 'description'}
            >
              {t('tab_description', 'Craft Story & Description')}
            </button>
            <button
              type="button"
              className={`product-tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => setActiveTab('materials')}
              role="tab"
              aria-selected={activeTab === 'materials'}
            >
              {t('tab_materials_care', 'Materials & Studio Care')}
            </button>
            <button
              type="button"
              className={`product-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              role="tab"
              aria-selected={activeTab === 'reviews'}
            >
              {t('tab_reviews', 'Collector Reviews')} ({product.reviewsCount})
            </button>
          </div>

          <div className="product-tabs-content">
            {/* Tab 1: Description Panel */}
            {activeTab === 'description' && (
              <div className="tab-pane tab-description-content">
                <div className="tab-description-text">
                  <h3>{t('artisan_heritage_title', 'Shaped with Human Soul & Heritage')}</h3>
                  <p>{product.description}</p>
                  <p>
                    {t('craft_narrative_p2', 'Each creation is individually shaped in independent artisan studios. Because natural materials like clay, solid timber, and hand-cast metals respond uniquely to heat and touch, minor textural variances are celebrated as the hallmark of authentic handcrafted art.')}
                  </p>
                  {maker?.bio && (
                    <p className="maker-bio-quote">
                      <strong>{maker.name}:</strong> "{maker.bio}"
                    </p>
                  )}
                </div>

                {maker?.studioImage && (
                  <div className="tab-studio-card">
                    <img
                      src={maker.studioImage}
                      alt={`${maker.name} working in studio`}
                    />
                    <div className="tab-studio-card-caption">
                      {maker.name} working inside the {maker.city} studio
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Materials & Care Panel */}
            {activeTab === 'materials' && (
              <div className="tab-pane tab-materials-grid">
                <div className="materials-col-card">
                  <h4>
                    <Sparkles size={18} className="text-terracotta" />
                    {t('materials_origin_title', 'Natural Mediums & Origins')}
                  </h4>
                  <ul className="materials-list">
                    {product.materials?.map((mat, i) => (
                      <li key={i}>
                        <span className="materials-bullet" />
                        <span>{mat}</span>
                      </li>
                    ))}
                    <li>
                      <span className="materials-bullet" />
                      <span>{t('dimensions', 'Dimensions')}: {product.dimensions}</span>
                    </li>
                  </ul>
                </div>

                <div className="materials-col-card">
                  <h4>
                    <Leaf size={18} className="text-sage" />
                    {t('care_instructions_title', 'Longevity & Maintenance')}
                  </h4>
                  <ul className="care-instructions-list">
                    <li className="care-item">
                      <CheckCircle2 size={16} className="care-icon" />
                      <span>{t('care_item_1', 'Wipe with a soft damp linen cloth; avoid abrasive chemical detergents.')}</span>
                    </li>
                    <li className="care-item">
                      <CheckCircle2 size={16} className="care-icon" />
                      <span>{t('care_item_2', 'Keep away from extreme sudden temperature fluctuations.')}</span>
                    </li>
                    <li className="care-item">
                      <CheckCircle2 size={16} className="care-icon" />
                      <span>{t('care_item_3', 'Handcrafted with natural organic pigments that mature beautifully over time.')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Reviews Panel */}
            {activeTab === 'reviews' && (
              <div className="tab-pane tab-reviews-container">
                <div className="reviews-summary-bar">
                  <div className="reviews-big-score">{product.rating}</div>
                  <div className="reviews-breakdown-info">
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill="#A85838" color="#A85838" />
                      ))}
                    </div>
                    <span>{t('based_on_reviews', 'Based on')} {product.reviewsCount} {t('verified_buyer_ratings', 'verified collector ratings')}</span>
                  </div>
                </div>

                <div className="reviews-cards-grid">
                  {productReviewsList.map((rev) => (
                    <div key={rev.id} className="review-card">
                      <div className="review-stars-row">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} size={14} fill="#A85838" color="#A85838" />
                        ))}
                      </div>
                      <p className="review-text-content">"{rev.content}"</p>
                      <div className="review-author-meta">
                        <span className="review-author-name">{rev.author}</span>
                        <span className="verified-buyer-badge">
                          <CheckCircle2 size={13} /> {t('verified_buyer', 'Verified Buyer')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. All Products Section (The Same Maker's Other Creations) */}
        {sortedMakerProducts.length > 0 && (
          <section className="maker-products-section" id="maker-all-products">
            <div className="shop-products-header">
              <div className="shop-header-left">
                <h2 className="heading-lg">
                  {t('more_from_artisan', 'More Handcrafted by')} {product.artisan}
                </h2>
                <p className="paragraph-lg maker-subtitle-line">
                  {sortedMakerProducts.length} {t('shop_pieces_count', 'pieces')} • {t('maker_creations_short', 'Handcrafted creations from this artisan studio')}
                </p>
                <div className="maker-header-accent-line" aria-hidden="true" />
              </div>

              {/* Controls Bar: Sort Dropdown & Maker Studio Action */}
              <div className="shop-controls-bar">
                <div className="shop-sort-wrapper">
                  <label htmlFor="maker-sort-select" className="sort-label">
                    {t('shop_sort_by', 'Sort by')}
                  </label>
                  <div className="sort-select-container">
                    <ArrowUpDown size={14} className="sort-prefix-icon" />
                    <select
                      id="maker-sort-select"
                      value={makerSortBy}
                      onChange={(e) => setMakerSortBy(e.target.value)}
                      className="shop-sort-select"
                      aria-label={t('shop_sort_by', 'Sort by')}
                    >
                      <option value="recommended">{t('sort_recommended', 'Recommended')}</option>
                      <option value="price-low">{t('sort_price_low', 'Price: Low to High')}</option>
                      <option value="price-high">{t('sort_price_high', 'Price: High to Low')}</option>
                      <option value="rating">{t('sort_rating', 'Highest Rated')}</option>
                    </select>
                    <ChevronDown size={14} className="select-arrow" />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-maker-studio"
                  onClick={() => maker && onOpenArtisanModal && onOpenArtisanModal(maker)}
                  aria-label={t('view_maker_studio', 'View Maker Studio')}
                >
                  <span>{t('view_maker_studio', 'View Maker Studio')}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            <div className="product-grid shop-product-grid">
              {visibleMakerProducts.map((makerProd) => (
                <ProductCard
                  key={makerProd.id}
                  product={makerProd}
                  isWishlisted={wishlist.includes(makerProd.id)}
                  onToggleWishlist={onToggleWishlist}
                  onOpenProductModal={() => onOpenProductModal && onOpenProductModal(makerProd)}
                  onAddToCart={onAddToCart}
                />
              ))}

              {/* Skeletons on loading more products */}
              {isMakerLoadingMore && (
                Array.from({ length: 4 }).map((_, idx) => (
                  <ProductCardSkeleton key={`maker-skeleton-${idx}`} />
                ))
              )}
            </div>

            {/* Load More Button for Maker Products */}
            {sortedMakerProducts.length > visibleMakerCount && (
              <div className="maker-load-more-wrapper">
                <button
                  type="button"
                  className="btn-maker-load-more"
                  onClick={handleLoadMoreMakerProducts}
                  disabled={isMakerLoadingMore}
                >
                  {isMakerLoadingMore ? (
                    <>
                      <span className="maker-spinner" />
                      <span>{t('loading_more', 'Loading more creations...')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('load_more_products', 'Load More Creations')}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        )}

        {/* 4. Related Products Section (Same Category & Style) */}
        {relatedCategoryProducts.length > 0 && (
          <section className="related-products-section">
            <div className="section-header-row">
              <div className="section-header-titles">
                <h2>{t('related_products_title', 'More Handcrafted in this Collection')}</h2>
                <p>{t('related_products_sub', 'Curated handcrafted treasures that pair well with this aesthetic')}</p>
              </div>
              <button
                type="button"
                className="btn-back-to-shop"
                onClick={() => onNavigate && onNavigate('/shop')}
              >
                <span>{t('explore_category', 'Explore Category')}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="product-grid">
              {relatedCategoryProducts.map((relProd) => (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  isWishlisted={wishlist.includes(relProd.id)}
                  onToggleWishlist={onToggleWishlist}
                  onOpenProductModal={() => onOpenProductModal && onOpenProductModal(relProd)}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* 5. Mobile Size Hero Section (Promotional Carousel: 2.5 Desktop / 1.5 Tablet / 1.0 Mobile) */}
        <section className="editorial-hero-section">
          <div className="section-header-row">
            <div className="section-header-titles">
              <h2>{t('editorial_section_title', 'Curated Artisan Stories & Craft Discoveries')}</h2>
              <p>{t('editorial_section_sub', 'Immerse in the ancestral traditions, natural mediums, and makers behind every piece')}</p>
            </div>
          </div>

          <div className="editorial-hero-wrapper">
            <div className="editorial-hero-track" ref={heroSliderRef}>
              {editorialHeroCards.map((hero) => (
                <div
                  key={hero.id}
                  className="editorial-hero-card"
                  onClick={() => onNavigate && onNavigate('/shop')}
                >
                  <img src={hero.image} alt={hero.title} className="editorial-hero-bg" loading="lazy" />
                  <div className="editorial-hero-overlay">
                    <span className="editorial-craft-tag">{t(hero.tagKey, hero.tag)}</span>
                    <h3 className="editorial-hero-title">{t(hero.titleKey, hero.title)}</h3>
                    <p className="editorial-hero-sub">{t(hero.subKey, hero.sub)}</p>
                    <span className="editorial-hero-cta">
                      <span>{t(hero.ctaKey, hero.cta)}</span>
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation Arrows */}
            <button
              type="button"
              className="editorial-slider-arrow editorial-slider-arrow-prev"
              onClick={() => handleScrollHero('prev')}
              aria-label="Previous story"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="editorial-slider-arrow editorial-slider-arrow-next"
              onClick={() => handleScrollHero('next')}
              aria-label="Next story"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* 6. Related Artisans Section */}
        {relatedArtisans.length > 0 && (
          <section className="related-artisans-section">
            <div className="section-header-row">
              <div className="section-header-titles">
                <h2>{t('related_artisans_title', 'Meet Related Master Artisans')}</h2>
                <p>{t('related_artisans_sub', 'Independent makers shaping handcrafted art in similar traditional mediums')}</p>
              </div>
            </div>

            <div className="editorial-hero-wrapper">
              <div className="related-artisans-track" ref={artisanSliderRef}>
                {relatedArtisans.map((art) => {
                  const isFollowing = followingArtisanIds.includes(art.id);

                  return (
                    <div
                      key={art.id}
                      className="related-artisan-card"
                      onClick={() => onOpenArtisanModal && onOpenArtisanModal(art)}
                    >
                      <div className="related-artisan-img-wrapper">
                        <div className="related-artisan-clip">
                          <img
                            src={art.studioImage}
                            alt={`${art.name} studio`}
                            className="related-artisan-img"
                            loading="lazy"
                          />
                        </div>

                        {/* Unclipped Avatar */}
                        <img
                          src={art.avatar}
                          alt={art.name}
                          className="related-artisan-avatar"
                        />

                        {/* Floating Follow Button */}
                        <button
                          type="button"
                          className={`related-artisan-follow-btn ${isFollowing ? 'following' : ''}`}
                          onClick={(e) => handleToggleFollow(e, art.id)}
                          aria-label={isFollowing ? `Unfollow ${art.name}` : `Follow ${art.name}`}
                        >
                          {isFollowing ? (
                            <>
                              <Check size={14} />
                              <span>{t('following', 'Following')}</span>
                            </>
                          ) : (
                            <>
                              <UserPlus size={14} />
                              <span>{t('follow', 'Follow')}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="related-artisan-content">
                        <h4 className="related-artisan-name">{art.name}</h4>
                        <span className="related-artisan-craft">{art.craft}</span>
                        <div className="related-artisan-loc">
                          <MapPin size={13} />
                          <span>{art.city}, {art.state}</span>
                        </div>
                        <p className="related-artisan-quote">"{art.quote}"</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Slider Navigation Arrows */}
              <button
                type="button"
                className="editorial-slider-arrow editorial-slider-arrow-prev"
                onClick={() => handleScrollArtisans('prev')}
                aria-label="Previous artisan"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="editorial-slider-arrow editorial-slider-arrow-next"
                onClick={() => handleScrollArtisans('next')}
                aria-label="Next artisan"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </section>
        )}

      </div>

      {/* Brand Values & Newsletter for Design Symmetry */}
      <BrandValues />
      <Newsletter />

      {/* Mobile Sticky Floating Purchase Bar */}
      <div className="product-mobile-sticky-bar">
        <div className="sticky-bar-left">
          <img src={product.image} alt={product.name} className="sticky-bar-thumb" />
          <div className="sticky-bar-meta">
            <span className="sticky-bar-name">{product.name}</span>
            <span className="sticky-bar-price">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary sticky-bar-btn"
          onClick={() => onAddToCart && onAddToCart(product, quantity)}
        >
          <ShoppingBag size={16} />
          <span>{t('add_to_cart', 'Add to Cart')}</span>
        </button>
      </div>
    </div>
  );
}
