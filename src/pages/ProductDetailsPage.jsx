import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Info,
} from "lucide-react";
import { products } from "../data/products";
import { artisans } from "../data/artisans";
import {
  editorialHeroCards,
  artisanShowcaseCards,
} from "../data/editorialHeroes";
import { getProductReviews } from "../data/reviews";
import { useLanguage } from "../i18n/LanguageContext";
import {
  MeetMakers,
  ProductAccordion,
  ProductCard,
  ProductCardSkeleton,
  BrandValues,
  Newsletter
} from "../components";

export default function ProductDetailsPage({
  productId,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onOpenArtisanModal,
  onOpenProductModal,
  onNavigate,
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
  const [activeAccordion, setActiveAccordion] = useState("description");

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  const [followingArtisanIds, setFollowingArtisanIds] = useState([]);
  const [makerSortBy, setMakerSortBy] = useState("recommended"); // 'recommended' | 'price-low' | 'price-high' | 'rating'

  // Pagination for Maker Products (Load More with skeleton loading)
  const INITIAL_MAKER_COUNT = 8;
  const [visibleMakerCount, setVisibleMakerCount] =
    useState(INITIAL_MAKER_COUNT);
  const [isMakerLoadingMore, setIsMakerLoadingMore] = useState(false);

  // Trending & Related Products Section State (Single-Row Infinite Horizontal Scrolling)
  const [trendingTab, setTrendingTab] = useState("All Related");
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [visibleTrendingCount, setVisibleTrendingCount] = useState(12);
  const [isTrendingLoadingMore, setIsTrendingLoadingMore] = useState(false);
  const trendingTrackRef = useRef(null);

  // Reset when viewing a different product
  useEffect(() => {
    if (product) {
      setSelectedImg(product.image);
      setQuantity(1);
      setActiveAccordion("description");
      setMakerSortBy("recommended");
      setVisibleMakerCount(INITIAL_MAKER_COUNT);
      setIsMakerLoadingMore(false);
      setTrendingTab("All Related");
      setVisibleTrendingCount(12);
      setIsTrendingLoadingMore(false);
      if (trendingTrackRef.current) {
        trendingTrackRef.current.scrollTo({ left: 0, behavior: "instant" });
      }
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
      (p) => p.artisan === product.artisan && p.id !== product.id,
    );
    // If maker has fewer than 4 other pieces, supplement with matching pieces from the same artisan craft or city
    if (others.length < 4) {
      const supplementary = products.filter(
        (p) =>
          p.id !== product.id &&
          !others.some((o) => o.id === p.id) &&
          (p.artisanCity === product.artisanCity ||
            p.category === product.category),
      );
      return [...others, ...supplementary].slice(0, 8);
    }
    return others;
  }, [product]);

  // Sorted maker products matching ShopPage sorting logic
  const sortedMakerProducts = useMemo(() => {
    let list = [...makerOtherProducts];
    if (makerSortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (makerSortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (makerSortBy === "rating") {
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

  // 4. Trending & Related Products Section Logic (Filtered dynamically according to active product)
  const trendingTabs = useMemo(
    () => [
      { id: "All Related", label: t("tab_all_related", "All Related") },
      {
        id: "Category",
        label: product?.category
          ? product.category
          : t("same_category", "Same Category"),
      },
      {
        id: "Style",
        label: product?.styleTag
          ? `${product.styleTag} Style`
          : t("tab_matching_style", "Matching Aesthetic"),
      },
      { id: "Trending", label: t("tab_trending", "Top Trending") },
      { id: "Bestseller", label: t("tab_top_sellers", "Bestsellers") },
    ],
    [product, t],
  );

  const allMatchingTrending = useMemo(() => {
    if (!product) return products;

    if (trendingTab === "Category") {
      const match = products.filter(
        (p) => p.id !== product.id && p.category === product.category,
      );
      return match.length > 0
        ? match
        : products.filter((p) => p.id !== product.id);
    }
    if (trendingTab === "Style") {
      const match = products.filter(
        (p) => p.id !== product.id && p.styleTag === product.styleTag,
      );
      return match.length > 0
        ? match
        : products.filter(
            (p) => p.id !== product.id && p.category === product.category,
          );
    }
    if (trendingTab === "Trending") {
      return products.filter(
        (p) => p.id !== product.id && (p.isTrending || p.badge === "Trending"),
      );
    }
    if (trendingTab === "Bestseller") {
      return products.filter(
        (p) =>
          p.id !== product.id &&
          (p.badge === "Top Seller" ||
            p.badge === "Bestseller" ||
            (p.rating && p.rating >= 4.85)),
      );
    }

    // Default 'All Related' - prioritize same category, then same style
    const sameCat = products.filter(
      (p) => p.id !== product.id && p.category === product.category,
    );
    const sameStyle = products.filter(
      (p) =>
        p.id !== product.id &&
        p.styleTag === product.styleTag &&
        p.category !== product.category,
    );
    const others = products.filter(
      (p) =>
        p.id !== product.id &&
        p.category !== product.category &&
        p.styleTag !== product.styleTag &&
        p.isTrending,
    );
    return [...sameCat, ...sameStyle, ...others];
  }, [product, trendingTab]);

  const trendingProductsList = useMemo(() => {
    if (allMatchingTrending.length === 0) return [];
    const base = allMatchingTrending.slice(0, visibleTrendingCount);
    // Duplicate items if count is small so horizontal scroll track is rich and continuous
    return base.length < 8 ? [...base, ...base, ...base] : base;
  }, [allMatchingTrending, visibleTrendingCount]);

  const handleTrendingTabChange = (tabId) => {
    if (tabId === trendingTab) return;
    setIsTrendingLoading(true);
    setTrendingTab(tabId);
    setVisibleTrendingCount(12);
    if (trendingTrackRef.current) {
      trendingTrackRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    setTimeout(() => {
      setIsTrendingLoading(false);
    }, 350);
  };

  const handleTrendingTrackScroll = () => {
    const el = trendingTrackRef.current;
    if (!el || isTrendingLoadingMore) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 360) {
      if (visibleTrendingCount < allMatchingTrending.length) {
        setIsTrendingLoadingMore(true);
        setTimeout(() => {
          setVisibleTrendingCount((prev) =>
            Math.min(prev + 6, allMatchingTrending.length),
          );
          setIsTrendingLoadingMore(false);
        }, 400);
      }
    }
  };

  const handleScrollTrendingLeft = () => {
    if (trendingTrackRef.current) {
      trendingTrackRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const handleScrollTrendingRight = () => {
    if (trendingTrackRef.current) {
      trendingTrackRef.current.scrollBy({ left: 340, behavior: "smooth" });
      const el = trendingTrackRef.current;
      if (
        el &&
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 500 &&
        !isTrendingLoadingMore
      ) {
        if (visibleTrendingCount < allMatchingTrending.length) {
          setIsTrendingLoadingMore(true);
          setTimeout(() => {
            setVisibleTrendingCount((prev) =>
              Math.min(prev + 6, allMatchingTrending.length),
            );
            setIsTrendingLoadingMore(false);
          }, 400);
        }
      }
    }
  };

  // 5. Related Artisans (Working in similar craft or region)
  const relatedArtisans = useMemo(() => {
    if (!product) return artisans.slice(0, 5);
    // Find artisans matching craft category keywords
    const categoryLower = product.category?.toLowerCase() || "";
    const matches = artisans.filter(
      (a) =>
        a.name !== product.artisan &&
        ((categoryLower.includes("ceramic") &&
          a.craft.toLowerCase().includes("ceramic")) ||
          (categoryLower.includes("pottery") &&
            a.craft.toLowerCase().includes("potter")) ||
          (categoryLower.includes("wood") &&
            a.craft.toLowerCase().includes("wood")) ||
          (categoryLower.includes("jewelry") &&
            a.craft.toLowerCase().includes("jewelry")) ||
          (categoryLower.includes("textile") &&
            a.craft.toLowerCase().includes("textile")) ||
          (categoryLower.includes("candle") &&
            a.craft.toLowerCase().includes("chandler"))),
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
        left: dir === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Slide-by-Slide Hero Carousel with Cloned Ends for Infinite Loop
  const showcaseSlides = artisanShowcaseCards;
  const totalSlides = showcaseSlides.length;

  // Extended slides with cloned head and tail: [last, ...slides, first]
  const extendedSlides = useMemo(() => {
    if (!showcaseSlides.length) return [];
    return [
      {
        ...showcaseSlides[showcaseSlides.length - 1],
        uniqueSlideKey: "clone-last",
      },
      ...showcaseSlides.map((s, i) => ({
        ...s,
        uniqueSlideKey: `real-${s.id}-${i}`,
      })),
      { ...showcaseSlides[0], uniqueSlideKey: "clone-first" },
    ];
  }, [showcaseSlides]);

  // currentIndex: 1 corresponds to showcaseSlides[0]
  const [slideIndex, setSlideIndex] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const autoplayTimerRef = useRef(null);

  // Active Dot index (0, 1, 2)
  const activeDotIndex = (slideIndex - 1 + totalSlides) % totalSlides;

  // Autoplay: 3 seconds dwell time on each hero
  useEffect(() => {
    if (isHovered || isDragging) return;

    autoplayTimerRef.current = setInterval(() => {
      setIsTransitionEnabled(true);
      setSlideIndex((prev) => prev + 1);
    }, 3000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isHovered, isDragging, slideIndex, totalSlides]);

  // Handle transition end for seamless infinite wrap
  const handleTransitionEnd = () => {
    if (slideIndex >= totalSlides + 1) {
      // Reached cloned first slide -> snap silently to real first slide (index 1)
      setIsTransitionEnabled(false);
      setSlideIndex(1);
    } else if (slideIndex <= 0) {
      // Reached cloned last slide -> snap silently to real last slide (index totalSlides)
      setIsTransitionEnabled(false);
      setSlideIndex(totalSlides);
    }
  };

  // Re-enable transitions on next animation frame if it was disabled for jump
  useEffect(() => {
    if (!isTransitionEnabled) {
      const raf = requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitionEnabled]);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    hasDraggedRef.current = false;
    setIsTransitionEnabled(false);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
    }
    dragOffsetRef.current = deltaX;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    setIsTransitionEnabled(true);

    const deltaX = dragOffsetRef.current;
    setDragOffset(0);
    dragOffsetRef.current = 0;

    if (deltaX < -50) {
      // Swiped Left -> advance to next slide
      setSlideIndex((prev) => prev + 1);
    } else if (deltaX > 50) {
      // Swiped Right -> go to previous slide
      setSlideIndex((prev) => prev - 1);
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    hasDraggedRef.current = false;
    setIsTransitionEnabled(false);
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
    }
    dragOffsetRef.current = deltaX;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    setIsTransitionEnabled(true);

    const deltaX = dragOffsetRef.current;
    setDragOffset(0);
    dragOffsetRef.current = 0;

    if (deltaX < -50) {
      setSlideIndex((prev) => prev + 1);
    } else if (deltaX > 50) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  // Card click (distinguishes drag vs pure click)
  const handleShowcaseCardClick = () => {
    if (hasDraggedRef.current) return;
    if (onNavigate) {
      onNavigate("/shop");
    }
  };

  // Dot Click handler
  const handleShowcaseDotClick = (targetDotIndex) => {
    setIsTransitionEnabled(true);
    setSlideIndex(targetDotIndex + 1);
  };

  // Artisans slider scroll controls
  const artisanSliderRef = useRef(null);
  const handleScrollArtisans = (dir) => {
    if (artisanSliderRef.current) {
      const scrollAmount = 300;
      artisanSliderRef.current.scrollBy({
        left: dir === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleToggleFollow = (e, artisanId) => {
    e.stopPropagation();
    setFollowingArtisanIds((prev) =>
      prev.includes(artisanId)
        ? prev.filter((id) => id !== artisanId)
        : [...prev, artisanId],
    );
  };

  const isWishlisted = wishlist.includes(product?.id);

  if (!product) return null;

  return (
    <div className="product-details-page">
      {/* 1. Main Product Showcase & Breadcrumbs Section (#FAF7F2) */}
      <section className="product-showcase-section">
        <div className="container">
          {/* Breadcrumb Bar */}
          <div className="product-breadcrumb-bar">
            <nav
              className="product-breadcrumbs"
              aria-label="Breadcrumb navigation"
            >
              <button
                type="button"
                className="breadcrumb-link"
                onClick={() => onNavigate && onNavigate("/")}
              >
                {t("nav_home", "Home")}
              </button>
              <span className="breadcrumb-sep">/</span>
              <button
                type="button"
                className="breadcrumb-link"
                onClick={() => onNavigate && onNavigate("/shop")}
              >
                {t("nav_shop", "Shop")}
              </button>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">{product.name}</span>
            </nav>

            {/* <button
              type="button"
              className="btn-back-to-shop"
              onClick={() => onNavigate && onNavigate("/shop")}
            >
              <ArrowLeft size={16} />
              <span>{t("back_to_shop", "Back to Catalog")}</span>
            </button> */}
          </div>

          <div className="product-showcase-grid">
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
                        selectedImg === imgUrl ? "active" : ""
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
                <span className="product-category-pill">
                  {product.category}
                </span>
                {product.styleTag && (
                  <span className="product-style-pill">
                    {product.styleTag} Style
                  </span>
                )}
              </div>

              <h1 className="product-page-title">{product.name}</h1>

              <div className="product-maker-row">
                <MapPin size={15} className="maker-city-icon" />
                <span>
                  {t("crafted_in", "Crafted in")} {product.artisanCity}{" "}
                  {t("by", "by")}{" "}
                  <button
                    type="button"
                    className="maker-link-btn"
                    onClick={() =>
                      maker && onOpenArtisanModal && onOpenArtisanModal(maker)
                    }
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
                  ({product.reviewsCount}{" "}
                  {t("verified_reviews", "verified reviews")})
                </span>
              </div>

              <div className="product-price-box">
                <span className="product-currency-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="product-tax-note">
                  {t("tax_included", "Inclusive of all taxes")}
                </span>
                <span className="product-stock-tag">
                  {t("in_stock", "In Stock")} ({product.stock}{" "}
                  {t("units_left", "units left")})
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
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      disabled={quantity >= product.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-add-cart-main"
                    onClick={() =>
                      onAddToCart && onAddToCart(product, quantity)
                    }
                  >
                    <ShoppingBag size={18} />
                    <span>{t("add_to_cart", "Add to Cart")}</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-wishlist-circle ${isWishlisted ? "active" : ""}`}
                    onClick={() =>
                      onToggleWishlist && onToggleWishlist(product.id)
                    }
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart size={20} fill={isWishlisted ? "#A85838" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Information & Reviews Section (#F3EFEA) */}
      <section className="product-tabs-section">
        <div className="container">
          <ProductAccordion
            product={product}
            maker={maker}
            productReviewsList={productReviewsList}
            t={t}
          />
        </div>
      </section>

      {/* 3. All Products Section (The Same Maker's Other Creations) (#FAF7F2) */}
      {sortedMakerProducts.length > 0 && (
        <section className="maker-products-section" id="maker-all-products">
          <div className="container">
            <div className="shop-products-header">
              <div className="shop-header-left">
                <h2 className="heading-lg">
                  {t("more_from_artisan", "More Handcrafted by")}{" "}
                  {product.artisan}
                </h2>
                <p className="paragraph-lg maker-subtitle-line">
                  {sortedMakerProducts.length}{" "}
                  {t("shop_pieces_count", "pieces")} •{" "}
                  {t(
                    "maker_creations_short",
                    "Handcrafted creations from this artisan studio",
                  )}
                </p>
                <div className="maker-header-accent-line" aria-hidden="true" />
              </div>

              {/* Controls Bar: Sort Dropdown & Maker Studio Action */}
              <div className="shop-controls-bar">
                <div className="shop-sort-wrapper">
                  <label htmlFor="maker-sort-select" className="sort-label">
                    {t("shop_sort_by", "Sort by")}
                  </label>
                  <div className="sort-select-container">
                    <ArrowUpDown size={14} className="sort-prefix-icon" />
                    <select
                      id="maker-sort-select"
                      value={makerSortBy}
                      onChange={(e) => setMakerSortBy(e.target.value)}
                      className="shop-sort-select"
                      aria-label={t("shop_sort_by", "Sort by")}
                    >
                      <option value="recommended">
                        {t("sort_recommended", "Recommended")}
                      </option>
                      <option value="price-low">
                        {t("sort_price_low", "Price: Low to High")}
                      </option>
                      <option value="price-high">
                        {t("sort_price_high", "Price: High to Low")}
                      </option>
                      <option value="rating">
                        {t("sort_rating", "Highest Rated")}
                      </option>
                    </select>
                    <ChevronDown size={14} className="select-arrow" />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-maker-studio"
                  onClick={() =>
                    maker && onOpenArtisanModal && onOpenArtisanModal(maker)
                  }
                  aria-label={t("view_maker_studio", "View Maker Studio")}
                >
                  <span>{t("view_maker_studio", "View Maker Studio")}</span>
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
                  onOpenProductModal={() =>
                    onOpenProductModal && onOpenProductModal(makerProd)
                  }
                  onAddToCart={onAddToCart}
                />
              ))}

              {/* Skeletons on loading more products */}
              {isMakerLoadingMore &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <ProductCardSkeleton key={`maker-skeleton-${idx}`} />
                ))}
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
                      <span>
                        {t("loading_more", "Loading more creations...")}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {t("load_more_products", "Load More Creations")}
                      </span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Artisan Craft Visual Showcase: 3s Autoplay Slide-by-Slide Banner (#F3EFEA) */}
      <section
        className="artisan-showcase-carousel-section"
        aria-label={t("artisan_showcase_title", "Artisan Craft Showcase")}
      >
        <div className="container">
          <div
            className="showcase-carousel-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              if (isDraggingRef.current) handleMouseUp();
            }}
          >
            <div
              className={`showcase-slide-viewport ${isDragging ? "is-dragging" : ""}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="region"
              aria-label={t(
                "artisan_gallery_track",
                "Artisan Studio Visual Gallery",
              )}
            >
              <div
                className="showcase-slide-strip"
                style={{
                  transform: `translateX(calc(-${slideIndex * 100}% + ${dragOffset}px))`,
                  transition:
                    isTransitionEnabled && !isDragging
                      ? "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)"
                      : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {extendedSlides.map((card) => (
                  <div
                    key={card.uniqueSlideKey}
                    className="showcase-single-slide"
                    onClick={() => handleShowcaseCardClick(card)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleShowcaseCardClick(card);
                      }
                    }}
                    aria-label={t(card.titleKey, card.title)}
                  >
                    <img
                      src={card.image}
                      alt={t(card.altKey, card.alt)}
                      className="showcase-single-img"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Centered Pagination Indicator Dots */}
            <div
              className="showcase-pagination-dots"
              role="tablist"
              aria-label="Showcase slides"
            >
              {showcaseSlides.map((card, idx) => (
                <button
                  key={`dot-${card.id}`}
                  type="button"
                  className={`showcase-dot ${activeDotIndex === idx ? "active" : ""}`}
                  onClick={() => handleShowcaseDotClick(idx)}
                  aria-label={`${t("go_to_slide", "Go to slide")} ${idx + 1}`}
                  aria-selected={activeDotIndex === idx}
                  role="tab"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending & Related Products Section (Single-Row Infinite Horizontal Scrolling) (#FAF7F2) */}
      <section
        className="shop-trending-section related-products-trending-section"
        id="shop-trending"
      >
        <div className="container">
          {/* Trending Header with Eyebrow, Title, Filter Strip & Nav Controls */}
          <div className="shop-trending-header">
            <div className="shop-trending-title-group">
              <span className="eyebrow">
                {t("story_badge", "Curated Selection")}
              </span>
              <h2 className="heading-lg">
                {t(
                  "related_products_title",
                  "More Handcrafted in this Collection",
                )}
              </h2>
              <p className="paragraph-lg shop-trending-subtitle">
                {t(
                  "related_products_sub",
                  "Curated handcrafted treasures that pair well with this aesthetic",
                )}
              </p>
            </div>

            {/* Filter Tabs & Quick Nav Arrows */}
            <div className="shop-trending-controls">
              <div
                className="trending-badges-strip"
                role="tablist"
                aria-label="Filter trending products"
              >
                {trendingTabs.map((tab) => {
                  const isActive = trendingTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      className={`trending-tab-btn ${isActive ? "active" : ""}`}
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
                  <div
                    key={`trending-row-skeleton-${idx}`}
                    className="trending-row-item"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : trendingProductsList.length > 0 ? (
                <>
                  {trendingProductsList.map((relProd, idx) => (
                    <div
                      key={`${relProd.id}-trending-${idx}`}
                      className="trending-row-item"
                    >
                      <ProductCard
                        product={relProd}
                        isWishlisted={wishlist.includes(relProd.id)}
                        onToggleWishlist={onToggleWishlist}
                        onOpenProductModal={() =>
                          onOpenProductModal && onOpenProductModal(relProd)
                        }
                        onAddToCart={onAddToCart}
                      />
                    </div>
                  ))}
                  {/* Appending skeleton cards while horizontally loading more */}
                  {isTrendingLoadingMore &&
                    Array.from({ length: 2 }).map((_, idx) => (
                      <div
                        key={`trending-more-skeleton-${idx}`}
                        className="trending-row-item trending-skeleton-item"
                      >
                        <ProductCardSkeleton />
                      </div>
                    ))}
                </>
              ) : (
                <div
                  className="shop-no-results text-center"
                  style={{ width: "100%", padding: "2rem 0" }}
                >
                  <p>
                    {t(
                      "no_matching_related_products",
                      "No related handcrafted items found in this filter.",
                    )}
                  </p>
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
        </div>
      </section>

      {/* 6. Promotional / Editorial Hero Section (#F3EFEA) */}
      <section className="editorial-hero-section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-header-titles">
              <h2>
                {t(
                  "editorial_section_title",
                  "Curated Artisan Stories & Craft Discoveries",
                )}
              </h2>
              <p>
                {t(
                  "editorial_section_sub",
                  "Immerse in the ancestral traditions, natural mediums, and makers behind every piece",
                )}
              </p>
            </div>
          </div>

          <div className="editorial-hero-wrapper">
            <div className="editorial-hero-track" ref={heroSliderRef}>
              {editorialHeroCards.map((hero) => (
                <div
                  key={hero.id}
                  className="editorial-hero-card"
                  onClick={() => onNavigate && onNavigate("/shop")}
                >
                  <img
                    src={hero.image}
                    alt={hero.title}
                    className="editorial-hero-bg"
                    loading="lazy"
                  />
                  <div className="editorial-hero-overlay">
                    <span className="editorial-craft-tag">
                      {t(hero.tagKey, hero.tag)}
                    </span>
                    <h3 className="editorial-hero-title">
                      {t(hero.titleKey, hero.title)}
                    </h3>
                    <p className="editorial-hero-sub">
                      {t(hero.subKey, hero.sub)}
                    </p>
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
              onClick={() => handleScrollHero("prev")}
              aria-label="Previous story"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="editorial-slider-arrow editorial-slider-arrow-next"
              onClick={() => handleScrollHero("next")}
              aria-label="Next story"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Meet Master Artisans (#FAF7F2) */}
      <MeetMakers onOpenArtisanModal={onOpenArtisanModal} />

      {/* 8. Brand Core Values (#F3EFEA) & 9. Community Newsletter (#FAF7F2) */}
      {/* <BrandValues />
       */}

      {/* Mobile Sticky Floating Purchase Bar */}
      <div className="product-mobile-sticky-bar">
        <div className="sticky-bar-left">
          <img
            src={product.image}
            alt={product.name}
            className="sticky-bar-thumb"
          />
          <div className="sticky-bar-meta">
            <span className="sticky-bar-name">{product.name}</span>
            <span className="sticky-bar-price">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary sticky-bar-btn"
          onClick={() => onAddToCart && onAddToCart(product, quantity)}
        >
          <ShoppingBag size={16} />
          <span>{t("add_to_cart", "Add to Cart")}</span>
        </button>
      </div>
    </div>
  );
}
