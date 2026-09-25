import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  Award,
  Package,
  Heart,
  Truck,
  Layers,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Edit3,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Briefcase,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { useNavigation } from "../context/NavigationContext";
import { products as allCatalogProducts } from "../data/products";
import { artisans as allArtisans } from "../data/artisans";
import { ProductCard, ProductCardSkeleton, ArtisanCardSkeleton } from "../components";

export default function ProfilePage({
  wishlist = [],
  authUser = null,
  onLogout,
  onToggleWishlist,
  onAddToCart,
  onOpenProductModal,
  onOpenArtisanModal,
  onNavigate,
  onGoBack,
  showToast,
}) {
  const { t } = useLanguage();
  const { getPageState, savePageState } = useNavigation ? useNavigation() : { getPageState: () => null, savePageState: () => {} };
  const initialSavedTab = getPageState ? getPageState("user_profile")?.activeTab : null;

  const [activeTab, setActiveTab] = useState(initialSavedTab || "orders"); // 'orders' | 'wishlist' | 'artisans' | 'perks'
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState(() => new Set([initialSavedTab || "orders"]));
  const tabLoadingTimeoutRef = useRef(null);
  const tabScrollPositionsRef = useRef({});
  const tabsAnchorRef = useRef(null);
  const tabsNavRef = useRef(null);
  const tabContainerRef = useRef(null);
  const perksSliderRef = useRef(null);
  const [perksCanScrollLeft, setPerksCanScrollLeft] = useState(false);
  const [perksCanScrollRight, setPerksCanScrollRight] = useState(true);

  const checkPerksScroll = useCallback(() => {
    if (!perksSliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = perksSliderRef.current;
    setPerksCanScrollLeft(scrollLeft > 4);
    setPerksCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    if (activeTab === "perks") {
      const timeoutId = setTimeout(() => {
        checkPerksScroll();
      }, 50);

      const slider = perksSliderRef.current;
      if (slider) {
        slider.addEventListener("scroll", checkPerksScroll, { passive: true });
        window.addEventListener("resize", checkPerksScroll);
      }
      return () => {
        clearTimeout(timeoutId);
        if (slider) {
          slider.removeEventListener("scroll", checkPerksScroll);
        }
        window.removeEventListener("resize", checkPerksScroll);
      };
    }
  }, [activeTab, checkPerksScroll]);

  const handlePerksScroll = (direction) => {
    if (!perksSliderRef.current) return;
    const container = perksSliderRef.current;
    const card = container.querySelector(".ap-how-card");
    const step = card ? card.offsetWidth + 16 : container.clientWidth * 0.5;
    const scrollAmount = direction === "left" ? -step : step;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Instantly align viewport to the START of the selected tab's content directly below sticky header
  const scrollToTabStart = useCallback((behavior = "instant") => {
    if (tabContainerRef.current && window.innerWidth > 1024) {
      tabContainerRef.current.scrollTo({ top: 0, behavior });
      return;
    }

    if (typeof window === "undefined") return;

    const headerEl = document.querySelector(".header-root");
    const headerHeight = headerEl
      ? headerEl.offsetHeight
      : window.innerWidth <= 767
        ? 60
        : 72;

    if (tabsAnchorRef.current) {
      const anchorRect = tabsAnchorRef.current.getBoundingClientRect();
      const currentScrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0;

      const targetScrollY = Math.max(
        0,
        Math.round(currentScrollY + anchorRect.top - headerHeight),
      );

      window.scrollTo({
        top: targetScrollY,
        behavior: behavior,
      });
    }
  }, []);

  // Handle internal scroll on tab container
  const handleTabContainerScroll = useCallback(
    (e) => {
      const target = e.currentTarget;
      if (!target || isTabLoading) return;
      tabScrollPositionsRef.current[activeTab] = target.scrollTop;
    },
    [activeTab, isTabLoading],
  );

  const handleTabChange = useCallback(
    (newTab) => {
      if (newTab === activeTab && !isTabLoading) {
        scrollToTabStart("instant");
        return;
      }

      // 1. Save scroll position of current active tab before switching
      const currentScrollY =
        tabContainerRef.current && window.innerWidth > 1024
          ? tabContainerRef.current.scrollTop
          : window.scrollY ||
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            0;
      tabScrollPositionsRef.current[activeTab] = currentScrollY;

      if (tabLoadingTimeoutRef.current) {
        clearTimeout(tabLoadingTimeoutRef.current);
      }

      setActiveTab(newTab);

      if (savePageState) {
        savePageState("user_profile", {
          activeTab: newTab,
          tabScrolls: tabScrollPositionsRef.current,
        });
      }

      const savedPosition = tabScrollPositionsRef.current[newTab];

      // 2. Only show 3-second skeleton on FIRST visit to this tab
      if (!loadedTabs.has(newTab)) {
        setIsTabLoading(true);
        scrollToTabStart("instant");
        tabLoadingTimeoutRef.current = setTimeout(() => {
          setIsTabLoading(false);
          setLoadedTabs((prev) => new Set([...prev, newTab]));
        }, 3000);
      } else {
        // 3. Tab was already visited: switch instantly & restore exact previous scroll position
        setIsTabLoading(false);
        if (savedPosition !== undefined && savedPosition !== null) {
          requestAnimationFrame(() => {
            if (tabContainerRef.current && window.innerWidth > 1024) {
              tabContainerRef.current.scrollTop = savedPosition;
            } else {
              window.scrollTo({
                top: savedPosition,
                behavior: "instant",
              });
            }
          });
        } else {
          scrollToTabStart("instant");
        }
      }
    },
    [activeTab, isTabLoading, loadedTabs, scrollToTabStart, savePageState],
  );

  useEffect(() => {
    return () => {
      if (tabLoadingTimeoutRef.current) {
        clearTimeout(tabLoadingTimeoutRef.current);
      }
    };
  }, []);

  const [isFollowingSuggested, setIsFollowingSuggested] = useState({});

  // Filter wishlisted products from global catalog
  const wishlistedProducts = useMemo(() => {
    return allCatalogProducts.filter((p) => wishlist.includes(p.id));
  }, [wishlist]);

  // Mock authentic handcrafted orders with full maker details
  const orders = [
    {
      id: "CRFT-84920",
      date: "Sep 12, 2026",
      status: "Delivered",
      artisan: allArtisans[0]?.name || "Elena Rostova",
      artisanData: allArtisans[0],
      item: allCatalogProducts[0]?.name || "Nordic Glazed Ceramic Vase",
      image:
        allCatalogProducts[0]?.image ||
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600&auto=format&fit=crop",
      price: allCatalogProducts[0]?.price || 4850,
      material: "Hand-thrown Stoneware & Natural Mineral Glaze",
      trackingNumber: "TRK-IN-982341",
    },
    {
      id: "CRFT-72104",
      date: "Aug 28, 2026",
      status: "In Transit",
      artisan: allArtisans[1]?.name || "Mateo Morales",
      artisanData: allArtisans[1],
      item: allCatalogProducts[2]?.name || "Scented Soy Botanical Candle",
      image:
        allCatalogProducts[2]?.image ||
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop",
      price: allCatalogProducts[2]?.price || 2200,
      material: "100% Organic Soy Wax & Pure Botanical Essences",
      trackingNumber: "TRK-IN-449102",
    },
  ];

  // Suggested makers for right sidebar
  const suggestedMakers = useMemo(() => {
    return allArtisans.slice(0, 4);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Aarav Sharma • Craftinator Patron Profile",
          text: "Explore handcrafted artisan collections and saved favorites on Craftinator",
          url,
        });
        return;
      } catch (err) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      if (showToast) showToast("Profile link copied to clipboard!");
    } catch (e) {
      if (showToast) showToast("Share link: " + url);
    }
  };

  const handleToggleSuggestedFollow = (makerId, makerName) => {
    setIsFollowingSuggested((prev) => {
      const next = !prev[makerId];
      if (showToast) {
        showToast(
          next
            ? `You are now following ${makerName}`
            : `Unfollowed ${makerName}`,
        );
      }
      return { ...prev, [makerId]: next };
    });
  };

  return (
    <main className="artisan-page-root profile-page-root animate-fade-in">
      <div className="ap-page-container">
        {/* Breadcrumb Navigation matching ArtisanDetailsPage */}
        <nav className="shop-hero-breadcrumb" aria-label="Breadcrumb">
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() =>
              onNavigate ? onNavigate("/") : onGoBack && onGoBack()
            }
          >
            {t("nav_home", "Home")}
          </button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">My Patron Profile</span>
        </nav>

        {/* ============================================================
            MAIN 2-COLUMN LAYOUT (1fr 340px)
            ============================================================ */}
        <div className="ap-layout-grid">
          {/* ----------------------------------------------------------
              LEFT COLUMN: Profile Card, Tabs & Content Panes
              ---------------------------------------------------------- */}
          <div className="ap-main-column">
            {/* PROFILE CARD matching ArtisanDetailsPage */}
            <section className="ap-profile-card">
              {/* Banner Image */}
              <div className="ap-profile-banner">
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1400&auto=format&fit=crop"
                  alt="Craft Studio & Pottery Collection"
                  loading="eager"
                />
              </div>

              {/* Avatar & Action Buttons Row (Overlaps Banner) */}
              <div className="ap-profile-actions-bar">
                <div className="ap-profile-avatar-box">
                  <img
                    src={authUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"}
                    alt={authUser?.name || "Aarav Sharma"}
                  />
                </div>

                <div className="ap-profile-btns-group">
                  <button
                    className="ap-message-btn"
                    onClick={() =>
                      showToast &&
                      showToast("Studio messaging is active for Patron members")
                    }
                    aria-label="Studio messages"
                    title="Studio Messages"
                  >
                    <MessageSquare size={18} />
                  </button>

                  <button
                    className="ap-share-btn"
                    onClick={handleShare}
                    aria-label="Share profile"
                    title="Share Profile"
                  >
                    <Share2 size={18} />
                  </button>

                  <button
                    className="ap-follow-pill-btn"
                    onClick={() => {
                      if (onNavigate) onNavigate("/settings");
                      else if (showToast) showToast("Account Settings opened");
                    }}
                  >
                    <Edit3 size={15} style={{ marginRight: "5px" }} />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Profile Details Body */}
              <div className="ap-profile-body">
                {/* Name & Verified Badge */}
                <div className="ap-profile-name-row">
                  <h1 className="ap-profile-name">{authUser?.name || "Aarav Sharma"}</h1>
                  <CheckCircle2
                    size={20}
                    className="ap-verified-check-icon"
                    fill="#2563EB"
                    color="#FFFFFF"
                    title="Verified Artisan Patron"
                  />
                </div>

                {/* Handle */}
                <div className="ap-profile-handle">
                  {authUser?.email ? `@${authUser.email.split('@')[0]}` : "@aarav_crafts"}
                </div>

                {/* Brand Tag Pill & Specialty Italics */}
                <div className="ap-brand-tag-row">
                  <span className="ap-brand-pill">
                    {authUser?.role || "Artisan Patron • Tier II"}
                  </span>
                  <span className="ap-craft-desc-italics">
                    Heritage Pottery & Handloom Collector
                  </span>
                </div>

                {/* Bio */}
                <p className="ap-profile-bio">
                  Collector of heritage pottery, organic linen & woodworks.
                  Passionate supporter of indigenous master craftspeople across
                  the globe.
                </p>

                {/* Meta Row: Location, Member Since, Impact */}
                <div className="ap-profile-meta-row">
                  <div className="ap-meta-detail">
                    <MapPin size={15} />
                    <span>{authUser?.location || "Portland, OR, USA"}</span>
                  </div>

                  <div className="ap-meta-detail">
                    <Calendar size={15} />
                    <span>{authUser?.memberSince ? `Member since ${authUser.memberSince}` : "Member since 2024"}</span>
                  </div>

                  <div className="ap-meta-detail">
                    <HeartHandshake size={15} color="#A85838" />
                    <span>100% Fair Trade Impact</span>
                  </div>

                  <div className="ap-meta-detail">
                    <Award size={15} color="#D97706" />
                    <span>Member ID: CRFT-PATRON-88</span>
                  </div>
                </div>

                {/* Stats Row: Orders, Saved, Makers Supported, Impact */}
                <div className="ap-profile-stats-row">
                  <div
                    className="ap-stat-item-inline"
                    onClick={() => handleTabChange("orders")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="ap-stat-num">{orders.length}</span>
                    <span className="ap-stat-lbl">Orders</span>
                  </div>

                  <div
                    className="ap-stat-item-inline"
                    onClick={() => handleTabChange("wishlist")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="ap-stat-num">{wishlist.length}</span>
                    <span className="ap-stat-lbl">Saved Crafts</span>
                  </div>

                  <div
                    className="ap-stat-item-inline"
                    onClick={() => handleTabChange("artisans")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="ap-stat-num">{allArtisans.length}</span>
                    <span className="ap-stat-lbl">Makers Supported</span>
                  </div>

                  <div
                    className="ap-stat-item-inline"
                    onClick={() => handleTabChange("perks")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="ap-stat-num">100%</span>
                    <span className="ap-stat-lbl">Fair Trade</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Hidden anchor element to mark exact top start of tab content directly under header */}
            <div
              ref={tabsAnchorRef}
              className="ap-tabs-anchor"
              style={{
                position: "relative",
                top: 0,
                height: 0,
                visibility: "hidden",
                pointerEvents: "none",
              }}
            />

            {/* NAVIGATION TABS matching ArtisanDetailsPage */}
            <nav
              ref={tabsNavRef}
              className="ap-nav-tabs-bar"
              aria-label="Profile navigation tabs"
            >
              <button
                type="button"
                className={`ap-nav-tab-btn ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => handleTabChange("orders")}
              >
                Orders & Deliveries ({orders.length})
              </button>

              <button
                type="button"
                className={`ap-nav-tab-btn ${activeTab === "wishlist" ? "active" : ""}`}
                onClick={() => handleTabChange("wishlist")}
              >
                Saved Wishlist ({wishlist.length})
              </button>

              <button
                type="button"
                className={`ap-nav-tab-btn ${activeTab === "artisans" ? "active" : ""}`}
                onClick={() => handleTabChange("artisans")}
              >
                Makers Supported ({allArtisans.length})
              </button>

              <button
                type="button"
                className={`ap-nav-tab-btn ${activeTab === "perks" ? "active" : ""}`}
                onClick={() => handleTabChange("perks")}
              >
                Patron Perks (4)
              </button>
            </nav>

            {/* TAB CONTENT SCROLL CONTAINER (Desktop Independent Scroll Container) */}
            <div
              ref={tabContainerRef}
              className="ap-tab-scroll-container"
              onScroll={handleTabContainerScroll}
            >
              {/* TAB CONTENT & SKELETON TRANSITION STATES */}
              {isTabLoading ? (
              <div
                className="animate-fade-in ap-tab-content-pane"
                aria-live="polite"
                aria-busy="true"
              >
                {activeTab === "orders" && (
                  <div className="ap-tab-skeleton-wrapper">
                    <div
                      className="skel-section-header align-left"
                      style={{ marginBottom: "1.75rem" }}
                    >
                      <div className="skel-block skel-eyebrow" />
                      <div
                        className="skel-block skel-title"
                        style={{ width: "min(340px, 75%)" }}
                      />
                      <div
                        className="skel-block skel-subtitle"
                        style={{ width: "min(460px, 90%)" }}
                      />
                    </div>
                    <div className="profile-orders-stack">
                      {[1, 2].map((idx) => (
                        <div
                          key={`order-skel-${idx}`}
                          className="skel-block"
                          style={{
                            width: "100%",
                            height: "190px",
                            borderRadius: "var(--radius-lg)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "wishlist" && (
                  <div className="ap-tab-skeleton-wrapper">
                    <div
                      className="skel-section-header align-left"
                      style={{ marginBottom: "1.75rem" }}
                    >
                      <div className="skel-block skel-eyebrow" />
                      <div
                        className="skel-block skel-title"
                        style={{ width: "min(320px, 70%)" }}
                      />
                    </div>
                    <div className="product-grid shop-product-grid">
                      <ProductCardSkeleton count={4} />
                    </div>
                  </div>
                )}

                {activeTab === "artisans" && (
                  <div className="ap-tab-skeleton-wrapper">
                    <div
                      className="skel-section-header align-left"
                      style={{ marginBottom: "1.75rem" }}
                    >
                      <div className="skel-block skel-eyebrow" />
                      <div
                        className="skel-block skel-title"
                        style={{ width: "min(340px, 75%)" }}
                      />
                    </div>
                    <div className="profile-makers-list skeleton-list">
                      <div className="skel-maker-row" />
                      <div className="skel-maker-row" />
                      <div className="skel-maker-row" />
                    </div>
                  </div>
                )}

                {activeTab === "perks" && (
                  <div className="ap-tab-skeleton-wrapper">
                    <div
                      className="skel-section-header align-left"
                      style={{ marginBottom: "1.75rem" }}
                    >
                      <div className="skel-block skel-eyebrow" />
                      <div
                        className="skel-block skel-title"
                        style={{ width: "min(360px, 80%)" }}
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "1.25rem",
                      }}
                    >
                      <div
                        className="skel-block"
                        style={{
                          height: "260px",
                          borderRadius: "var(--radius-lg)",
                        }}
                      />
                      <div
                        className="skel-block"
                        style={{
                          height: "260px",
                          borderRadius: "var(--radius-lg)",
                        }}
                      />
                      <div
                        className="skel-block"
                        style={{
                          height: "260px",
                          borderRadius: "var(--radius-lg)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* ========================================================
                    TAB 1: ORDERS & DELIVERIES
                    ======================================================== */}
                {activeTab === "orders" && (
                  <div className="animate-fade-in ap-tab-content-pane">
                <section className="ap-tab-section">
                  <div className="ap-tab-section-header">
                    <div className="ap-eyebrow-row">
                      <span className="ap-section-eyebrow">
                        Studio Purchases
                      </span>
                      <span className="ap-count-badge">
                        {orders.length} Recorded
                      </span>
                    </div>
                    <h2 className="ap-section-title">
                      Your Handcrafted Orders
                    </h2>
                    <p className="ap-section-subtitle">
                      Direct from independent artisan workshops. Every order is
                      verified with carbon-neutral transit.
                    </p>
                  </div>

                  <div className="profile-orders-stack">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="profile-order-card-harmonized"
                      >
                        <div className="profile-order-card-top">
                          <div className="profile-order-id-group">
                            <span className="profile-order-id-label">
                              Order
                            </span>
                            <span className="profile-order-id-code">
                              {order.id}
                            </span>
                            <span className="profile-order-dot">•</span>
                            <span className="profile-order-date">
                              {order.date}
                            </span>
                          </div>

                          <div
                            className={`profile-order-status-badge ${order.status.toLowerCase().replace(" ", "-")}`}
                          >
                            <span className="status-indicator-dot" />
                            <span>{order.status}</span>
                          </div>
                        </div>

                        <div className="profile-order-card-main">
                          <div className="profile-order-thumb-box">
                            <img src={order.image} alt={order.item} />
                          </div>

                          <div className="profile-order-details">
                            <h3 className="profile-order-item-name">
                              {order.item}
                            </h3>
                            <div className="profile-order-maker-line">
                              <span>Handcrafted by </span>
                              <button
                                type="button"
                                className="profile-order-maker-btn"
                                onClick={() =>
                                  order.artisanData &&
                                  onOpenArtisanModal &&
                                  onOpenArtisanModal(order.artisanData)
                                }
                              >
                                {order.artisan}
                              </button>
                            </div>
                            <p className="profile-order-material-tag">
                              {order.material}
                            </p>
                            <div className="profile-order-price-row">
                              <span className="profile-order-price-val">
                                ₹{order.price.toLocaleString("en-IN")}
                              </span>
                              <span className="profile-order-tax-tag">
                                Inclusive of taxes & shipping
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="profile-order-card-footer">
                          <div className="profile-order-tracking-info">
                            <Truck size={15} color="var(--accent-terracotta)" />
                            <span>
                              Tracking: <strong>{order.trackingNumber}</strong>
                            </span>
                          </div>

                          <div className="profile-order-actions-cluster">
                            <button
                              type="button"
                              className="btn-profile-order-action btn-secondary-order"
                              onClick={() => {
                                if (showToast)
                                  showToast(
                                    `Provenance certificate generated for ${order.id}`,
                                  );
                              }}
                            >
                              <ShieldCheck size={14} />
                              Certificate
                            </button>

                            <button
                              type="button"
                              className="btn-profile-order-action btn-primary-order"
                              onClick={() => {
                                if (showToast)
                                  showToast(
                                    `Live tracking for ${order.trackingNumber} opened`,
                                  );
                              }}
                            >
                              <Truck size={14} />
                              Track Package
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================
                TAB 2: SAVED WISHLIST (Standard ProductCard Grid)
                ======================================================== */}
            {activeTab === "wishlist" && (
              <div className="animate-fade-in ap-tab-content-pane">
                <section className="ap-tab-section">
                  <div className="ap-tab-section-header">
                    <div className="ap-eyebrow-row">
                      <span className="ap-section-eyebrow">
                        Curated Collection
                      </span>
                      <span className="ap-count-badge">
                        {wishlistedProducts.length} Saved
                      </span>
                    </div>
                    <h2 className="ap-section-title">Your Saved Wishlist</h2>
                    <p className="ap-section-subtitle">
                      One-of-a-kind handcrafted pieces you have favorited. Add
                      them to your collection before they sell out.
                    </p>
                  </div>

                  {wishlistedProducts.length === 0 ? (
                    <div className="profile-empty-collection-box">
                      <div className="profile-empty-icon-circle">
                        <Heart size={36} color="var(--accent-terracotta)" />
                      </div>
                      <h3 className="profile-empty-title">
                        Your wishlist is currently empty
                      </h3>
                      <p className="profile-empty-desc">
                        Explore authentic creations shaped by master artisans
                        and click the heart icon on any piece to curate your
                        personal collection.
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => onNavigate && onNavigate("/shop")}
                        style={{ minWidth: "200px" }}
                      >
                        Explore Handcrafted Shop
                      </button>
                    </div>
                  ) : (
                    <div className="product-grid shop-product-grid">
                      {wishlistedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isWishlisted={true}
                          onToggleWishlist={onToggleWishlist}
                          onOpenProductModal={onOpenProductModal}
                          onAddToCart={onAddToCart}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ========================================================
                TAB 3: MAKERS SUPPORTED
                ======================================================== */}
            {activeTab === "artisans" && (
              <div className="animate-fade-in ap-tab-content-pane">
                <section className="ap-tab-section">
                  <div className="ap-tab-section-header">
                    <div className="ap-eyebrow-row">
                      <span className="ap-section-eyebrow">
                        Studio Community
                      </span>
                      <span className="ap-count-badge">
                        {allArtisans.length} Studios
                      </span>
                    </div>
                    <h2 className="ap-section-title">
                      Master Artisans You Support
                    </h2>
                    <p className="ap-section-subtitle">
                      Independent creators preserving ancestral crafts across
                      India and beyond.
                    </p>
                  </div>

                  <div className="profile-makers-list">
                    {allArtisans.map((maker) => {
                      const isFollowed = isFollowingSuggested[maker.id] ?? true;
                      const handle =
                        maker.handle || `@${maker.id.replace(/-/g, "")}`;
                      const bioText =
                        maker.bio ||
                        maker.story ||
                        (maker.specialties
                          ? maker.specialties.join(" • ")
                          : maker.craftSpecialty);

                      return (
                        <div key={maker.id} className="profile-maker-card">
                          <button
                            type="button"
                            className="profile-maker-avatar-wrap"
                            onClick={() =>
                              onOpenArtisanModal && onOpenArtisanModal(maker)
                            }
                            aria-label={`View ${maker.name}'s studio`}
                          >
                            <img
                              src={maker.avatar}
                              alt={maker.name}
                              className="profile-maker-avatar"
                            />
                          </button>

                          <div className="profile-maker-content">
                            <div className="profile-maker-top-row">
                              <div className="profile-maker-info-col">
                                <div className="profile-maker-name-row">
                                  <button
                                    type="button"
                                    className="profile-maker-name-link"
                                    onClick={() =>
                                      onOpenArtisanModal &&
                                      onOpenArtisanModal(maker)
                                    }
                                  >
                                    <h4 className="profile-maker-name">
                                      {maker.name}
                                    </h4>
                                  </button>
                                  <CheckCircle2
                                    size={15}
                                    fill="#1D9BF0"
                                    color="#FFFFFF"
                                    className="profile-maker-verified-badge"
                                  />
                                </div>
                                <span className="profile-maker-handle">
                                  {handle}
                                </span>
                              </div>

                              <button
                                type="button"
                                className={`btn-maker-card-follow ${isFollowed ? "following" : ""}`}
                                onClick={() =>
                                  handleToggleSuggestedFollow(
                                    maker.id,
                                    maker.name,
                                  )
                                }
                              >
                                {isFollowed ? "Following" : "Follow"}
                              </button>
                            </div>

                            {bioText && (
                              <p className="profile-maker-bio">{bioText}</p>
                            )}

                            <div className="profile-maker-meta-row">
                              {maker.city && (
                                <span className="profile-maker-location">
                                  <MapPin size={12} /> {maker.city},{" "}
                                  {maker.state || "India"}
                                </span>
                              )}
                              <button
                                type="button"
                                className="profile-maker-studio-link"
                                onClick={() =>
                                  onOpenArtisanModal &&
                                  onOpenArtisanModal(maker)
                                }
                              >
                                <ExternalLink size={12} />
                                craftinator.in/studio/{maker.id}
                              </button>
                              <span className="profile-maker-craft-tag">
                                {maker.craft || "Artisan Craft"}
                              </span>
                              <button
                                type="button"
                                className="btn-maker-card-view"
                                onClick={() =>
                                  onOpenArtisanModal &&
                                  onOpenArtisanModal(maker)
                                }
                              >
                                View Studio
                                <ChevronRight size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================
                TAB 4: PATRON PERKS (How It's Made / Craft Process Cards)
                ======================================================== */}
            {activeTab === "perks" && (
              <div className="animate-fade-in ap-tab-content-pane">
                <section
                  className="ap-how-section"
                  style={{ borderTop: "none", paddingTop: "0.5rem", marginBottom: "0.5rem" }}
                >
                  <div
                    className="ap-how-header"
                    style={{ marginBottom: "1.75rem" }}
                  >
                    <div
                      className="ap-eyebrow-row"
                      style={{ justifyContent: "center" }}
                    >
                      <span className="ap-section-eyebrow">
                        Tier II Collector Privileges
                      </span>
                    </div>
                    <h2
                      className="ap-how-title"
                      style={{ fontSize: "1.85rem" }}
                    >
                      Patron Member Benefits
                    </h2>
                    <span className="ap-how-subtitle">
                      Your direct patronage supports living artisan heritage,
                      ethical living wages, and ancestral craftsmanship.
                    </span>
                  </div>

                  <div className="profile-perks-slider-wrapper">
                    <button
                      type="button"
                      className="profile-perks-nav-btn profile-perks-nav-btn-prev"
                      onClick={() => handlePerksScroll("left")}
                      disabled={!perksCanScrollLeft}
                      aria-label="Previous perks"
                      title="Previous perks"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div
                      ref={perksSliderRef}
                      className="profile-perks-slider-track"
                    >
                      <div className="ap-how-card">
                        <div className="ap-how-media">
                          <img
                            src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop"
                            alt="Early studio access"
                            loading="lazy"
                          />
                        </div>
                        <div className="ap-how-body">
                          <div className="profile-perk-badge-row">
                            <Sparkles
                              size={16}
                              color="var(--accent-terracotta)"
                            />
                            <span className="profile-perk-step-tag">
                              Exclusive Privilege
                            </span>
                          </div>
                          <h4 className="ap-how-step-name">
                            24-Hour Early Studio Access
                          </h4>
                          <p className="ap-how-step-desc">
                            Gain exclusive preview and purchasing rights 24 hours
                            before limited-edition studio drops are made public.
                          </p>
                        </div>
                      </div>

                      <div className="ap-how-card">
                        <div className="ap-how-media">
                          <img
                            src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600&auto=format&fit=crop"
                            alt="Plastic-free packaging"
                            loading="lazy"
                          />
                        </div>
                        <div className="ap-how-body">
                          <div className="profile-perk-badge-row">
                            <Truck size={16} color="var(--accent-terracotta)" />
                            <span className="profile-perk-step-tag">
                              Eco Standard
                            </span>
                          </div>
                          <h4 className="ap-how-step-name">
                            100% Carbon-Neutral Shipping
                          </h4>
                          <p className="ap-how-step-desc">
                            All orders are packed in biodegradable mulberry paper
                            and shipped with verified climate carbon offset
                            credits.
                          </p>
                        </div>
                      </div>

                      <div className="ap-how-card">
                        <div className="ap-how-media">
                          <img
                            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop"
                            alt="Authenticity certificate"
                            loading="lazy"
                          />
                        </div>
                        <div className="ap-how-body">
                          <div className="profile-perk-badge-row">
                            <ShieldCheck
                              size={16}
                              color="var(--accent-terracotta)"
                            />
                            <span className="profile-perk-step-tag">
                              Provenance Guarantee
                            </span>
                          </div>
                          <h4 className="ap-how-step-name">
                            Physical Certificate of Provenance
                          </h4>
                          <p className="ap-how-step-desc">
                            Every acquisition includes a hand-embossed provenance
                            card signed by the master maker verifying studio
                            origin.
                          </p>
                        </div>
                      </div>

                      <div className="ap-how-card">
                        <div className="ap-how-media">
                          <img
                            src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=600&auto=format&fit=crop"
                            alt="Studio Commission"
                            loading="lazy"
                          />
                        </div>
                        <div className="ap-how-body">
                          <div className="profile-perk-badge-row">
                            <HeartHandshake
                              size={16}
                              color="var(--accent-terracotta)"
                            />
                            <span className="profile-perk-step-tag">
                              Artisan Connection
                            </span>
                          </div>
                          <h4 className="ap-how-step-name">
                            Custom Commission Priority
                          </h4>
                          <p className="ap-how-step-desc">
                            Request bespoke dimensions, glaze treatments, or
                            personalized inscriptions directly with certified
                            ateliers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="profile-perks-nav-btn profile-perks-nav-btn-next"
                      onClick={() => handlePerksScroll("right")}
                      disabled={!perksCanScrollRight}
                      aria-label="Next perks"
                      title="Next perks"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </section>
              </div>
            )}
          </>
        )}
            </div>
          </div>

          {/* ----------------------------------------------------------
              RIGHT COLUMN: Sticky Sidebar matching ArtisanDetailsPage
              ---------------------------------------------------------- */}
          <aside className="ap-sidebar-column">
            {/* SIDEBAR CARD 1: Patron Impact & Status */}
            <div className="ap-sidebar-card">
              <div className="profile-sidebar-impact-header">
                <span
                  className="ap-section-eyebrow"
                  style={{ marginBottom: "0.25rem" }}
                >
                  Patron Impact
                </span>
                <h2
                  className="ap-sidebar-card-title"
                  style={{ marginBottom: "0.85rem" }}
                >
                  Tier II Patron Level
                </h2>
              </div>

              <div className="profile-impact-progress-block">
                <div className="profile-impact-bar-labels">
                  <span>Tier II Patron</span>
                  <strong>84% to Tier III</strong>
                </div>
                <div className="profile-impact-progress-track">
                  <div
                    className="profile-impact-progress-fill"
                    style={{ width: "84%" }}
                  />
                </div>
                <span className="profile-impact-progress-note">
                  ₹1,500 away from unlocking Lifetime Free Artisan Delivery
                </span>
              </div>

              <div className="profile-impact-badges-grid">
                <div className="profile-impact-stat-pill">
                  <Award size={18} color="var(--accent-terracotta)" />
                  <div>
                    <strong>12 Studios</strong>
                    <span>Directly Sustained</span>
                  </div>
                </div>

                <div className="profile-impact-stat-pill">
                  <ShieldCheck size={18} color="var(--accent-sage)" />
                  <div>
                    <strong>100% Fair</strong>
                    <span>Verified Living Wage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR CARD 2: Suggested Artisans to Follow */}
            <div className="ap-sidebar-card">
              <h2 className="ap-sidebar-card-title">Artisans you may like</h2>

              <div className="ap-suggested-makers-list">
                {suggestedMakers.map((maker) => (
                  <div key={maker.id} className="ap-suggested-maker-row">
                    <div
                      className="ap-sugg-author-info"
                      onClick={() =>
                        onOpenArtisanModal && onOpenArtisanModal(maker)
                      }
                      title={`View ${maker.name}'s studio`}
                    >
                      <img
                        src={maker.avatar}
                        alt={maker.name}
                        className="ap-sugg-avatar"
                      />
                      <div className="ap-sugg-name-col">
                        <div className="ap-sugg-name-row">
                          <span className="ap-sugg-name">{maker.name}</span>
                          <CheckCircle2
                            size={13}
                            fill="#2563EB"
                            color="#FFFFFF"
                          />
                        </div>
                        <span className="ap-sugg-handle">
                          {maker.craft || maker.city}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`ap-sugg-follow-btn ${isFollowingSuggested[maker.id] ? "following" : ""}`}
                      onClick={() =>
                        handleToggleSuggestedFollow(maker.id, maker.name)
                      }
                    >
                      {isFollowingSuggested[maker.id] ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDEBAR CARD 3: Account Quick Actions */}
            <div className="ap-sidebar-card">
              <h2 className="ap-sidebar-card-title">Quick Settings</h2>

              <div className="profile-sidebar-shortcuts">
                <button
                  type="button"
                  className="profile-shortcut-row"
                  onClick={() => {
                    if (onNavigate) onNavigate("/settings");
                    else if (showToast) showToast("Shipping addresses opened");
                  }}
                >
                  <div className="profile-shortcut-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="profile-shortcut-text">
                    <span className="profile-shortcut-title">
                      Shipping Addresses
                    </span>
                    <span className="profile-shortcut-sub">
                      Portland, OR (Default)
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="profile-shortcut-chevron"
                  />
                </button>

                <button
                  type="button"
                  className="profile-shortcut-row"
                  onClick={() => {
                    if (onNavigate) onNavigate("/settings");
                    else if (showToast) showToast("Payment settings opened");
                  }}
                >
                  <div className="profile-shortcut-icon">
                    <Award size={16} />
                  </div>
                  <div className="profile-shortcut-text">
                    <span className="profile-shortcut-title">
                      Payment Methods
                    </span>
                    <span className="profile-shortcut-sub">
                      UPI & Cards verified
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="profile-shortcut-chevron"
                  />
                </button>

                <button
                  type="button"
                  className="profile-shortcut-row"
                  onClick={() => {
                    if (showToast) showToast("Craft care concierge opened");
                  }}
                >
                  <div className="profile-shortcut-icon">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="profile-shortcut-text">
                    <span className="profile-shortcut-title">
                      Craft Care Concierge
                    </span>
                    <span className="profile-shortcut-sub">
                      Returns & Authenticity help
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="profile-shortcut-chevron"
                  />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
