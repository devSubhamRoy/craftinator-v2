import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Share2,
  Heart,
  Star,
  MapPin,
  Calendar,
  X,
  Send,
  Sparkles,
  Layers,
  Clock,
  Briefcase,
  HeartHandshake,
  ArrowRight,
  MoreHorizontal,
  Globe,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { useNavigation } from "../context/NavigationContext";
import { artisans } from "../data/artisans";
import { products as allCatalogProducts } from "../data/products";
import { trendingCrafts } from "../data/trendingCrafts";
import { ProductCard, ProductCardSkeleton } from "../components";

// Dynamic formatter turning any artisan into the harmonized profile format
function formatArtisanProfile(artisanData) {
  if (!artisanData) return null;

  const artId =
    artisanData.id || artisanData.name.toLowerCase().replace(/\s+/g, "-");

  // Studio / Brand Name
  const studioAddress = artisanData.studioDetails?.address || "";
  const firstStudioWord = studioAddress.split(",")[0].trim();
  const brandPill =
    artisanData.brandName ||
    (firstStudioWord && !firstStudioWord.includes("Studio")
      ? firstStudioWord
      : "") ||
    `${artisanData.name.split(" ")[0]} Studio`;

  // Filter products for this specific artisan from catalog
  const catalogProductsForArtisan = allCatalogProducts.filter((p) => {
    if (!p.artisan) return false;
    const prodArtisanLower = p.artisan.toLowerCase().trim();
    const targetArtisanLower = artisanData.name.toLowerCase().trim();
    return (
      prodArtisanLower === targetArtisanLower ||
      prodArtisanLower.includes(targetArtisanLower) ||
      targetArtisanLower.includes(prodArtisanLower)
    );
  });

  // Map to card format ensuring standard ProductCard contract
  let productsList = catalogProductsForArtisan.map((p) => ({
    ...p,
    artisan: artisanData.name,
    artisanCity: p.artisanCity || artisanData.city,
    brand: brandPill,
    price: p.price,
    originalPrice:
      p.originalPrice || (p.price > 1800 ? Math.round(p.price * 1.25) : null),
    rating: p.rating || artisanData.rating || 4.8,
    reviewsCount: p.reviewsCount || 24,
    location: `${artisanData.city}, ${artisanData.state ? artisanData.state.slice(0, 2) : "IN"}`,
    fullLocation: `${artisanData.city}, ${artisanData.state || "India"}`,
    badge: p.badge || "HANDMADE",
    image: p.image,
    category: p.category,
  }));

  // If catalog has no products for this artisan, synthesize based on artisan's studio work
  if (productsList.length === 0) {
    productsList = [
      {
        id: `${artId}-prod-1`,
        name: `${artisanData.name.split(" ")[0]} Signature ${artisanData.craft ? artisanData.craft.split(" ")[0] : "Artisan"} Piece`,
        artisan: artisanData.name,
        artisanCity: artisanData.city,
        brand: brandPill,
        price: 1850,
        originalPrice: 2250,
        rating: artisanData.rating || 4.9,
        reviewsCount: 38,
        location: `${artisanData.city}, ${artisanData.state || "India"}`,
        fullLocation: `${artisanData.city}, ${artisanData.state || "India"}`,
        badge: "MASTERPIECE",
        image: artisanData.workImage1 || artisanData.studioImage,
        category: artisanData.craft || "Craft",
        description: `Handcrafted with care by ${artisanData.name} in ${artisanData.city}.`,
      },
      {
        id: `${artId}-prod-2`,
        name: `Handcrafted ${artisanData.specialties ? artisanData.specialties[0] : "Studio Creation"}`,
        artisan: artisanData.name,
        artisanCity: artisanData.city,
        brand: brandPill,
        price: 2450,
        originalPrice: 2800,
        rating: 4.85,
        reviewsCount: 29,
        location: `${artisanData.city}, ${artisanData.state || "India"}`,
        fullLocation: `${artisanData.city}, ${artisanData.state || "India"}`,
        badge: "HANDMADE",
        image: artisanData.workImage2 || artisanData.studioImage,
        category: artisanData.craft || "Craft",
        description: `Authentic artisan technique by ${artisanData.name}.`,
      },
      {
        id: `${artId}-prod-3`,
        name: `Heritage Studio Original`,
        artisan: artisanData.name,
        artisanCity: artisanData.city,
        brand: brandPill,
        price: 1650,
        originalPrice: null,
        rating: 4.9,
        reviewsCount: 44,
        location: `${artisanData.city}, ${artisanData.state || "India"}`,
        fullLocation: `${artisanData.city}, ${artisanData.state || "India"}`,
        badge: "ORIGINAL",
        image: artisanData.studioImage || artisanData.workImage1,
        category: artisanData.craft || "Craft",
        description: `Studio original piece made by ${artisanData.name}.`,
      },
      {
        id: `${artId}-prod-4`,
        name: `${artisanData.craftSpecialty || artisanData.craft || "Artisan"} Form No. 4`,
        artisan: artisanData.name,
        artisanCity: artisanData.city,
        brand: brandPill,
        price: 3100,
        originalPrice: 3650,
        rating: 5.0,
        reviewsCount: 21,
        badge: "LIMITED",
        image: artisanData.workImage1 || artisanData.studioImage,
        category: artisanData.craft || "Craft",
        description: `Limited studio release by ${artisanData.name}.`,
      },
    ];
  }

  // Parse followers count
  let followersNum = 2450;
  if (typeof artisanData.followersCount === "number") {
    followersNum = artisanData.followersCount;
  } else if (typeof artisanData.followersCount === "string") {
    const raw = artisanData.followersCount.toLowerCase().trim();
    if (raw.includes("k")) {
      followersNum = Math.round(parseFloat(raw) * 1000);
    } else {
      followersNum = parseInt(raw, 10) || 2450;
    }
  }

  // Joined year calculation
  const joinedYear =
    artisanData.joinedYear ||
    (artisanData.yearsOfExperience
      ? String(2026 - artisanData.yearsOfExperience)
      : "2020");

  // Process Steps
  const steps =
    artisanData.processSteps && artisanData.processSteps.length > 0
      ? artisanData.processSteps.map((s, idx) => ({
          name: s.title || `Step ${idx + 1}`,
          desc: s.desc || "",
          image:
            idx === 0
              ? artisanData.workImage1 || artisanData.studioImage
              : idx === 1
                ? artisanData.workImage2 || artisanData.studioImage
                : artisanData.studioImage,
        }))
      : [
          {
            name: "Source",
            desc: "Harvesting purest natural materials with ethical care.",
            image: artisanData.workImage1 || artisanData.studioImage,
          },
          {
            name: "Shape",
            desc: "Shaping by hand using ancestral artisan techniques.",
            image: artisanData.workImage2 || artisanData.studioImage,
          },
          {
            name: "Refine",
            desc: "Slow hand-carving, polishing and contour detail work.",
            image: artisanData.studioImage,
          },
          {
            name: "Cure",
            desc: "Natural courtyard drying and mineral heat curing.",
            image: artisanData.workImage1 || artisanData.studioImage,
          },
          {
            name: "Finish",
            desc: "Final botanical oil or ash glaze inspection.",
            image: artisanData.workImage2 || artisanData.studioImage,
          },
        ];

  // Moments strip photos
  const moments = [
    artisanData.studioImage,
    artisanData.workImage1 || artisanData.studioImage,
    artisanData.workImage2 || artisanData.studioImage,
    artisanData.avatar,
    artisanData.workImage1 || artisanData.studioImage,
    artisanData.studioImage,
  ].filter(Boolean);

  return {
    id: artId,
    name: artisanData.name,
    handle:
      artisanData.handle ||
      `@${artisanData.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    brandName: brandPill,
    craftSpecialty: artisanData.craftSpecialty || artisanData.craft,
    craft: artisanData.craft,
    city: artisanData.city,
    state: artisanData.state,
    joinedYear,
    yearsOfExperience: artisanData.yearsOfExperience || 6,
    rating: artisanData.rating || 4.8,
    reviewsCount: artisanData.reviewsCount || 168,
    followingCount:
      artisanData.followingCount ||
      Math.max(14, Math.floor(followersNum / 5.5)),
    followersCount: followersNum,
    website:
      artisanData.website ||
      `${(artisanData.handle || artisanData.name).toLowerCase().replace(/[^a-z0-9]/g, "")}.craftinator.in`,
    creationsCount: productsList.length,
    avatar: artisanData.avatar,
    banner: artisanData.studioImage || artisanData.workImage1,
    bio: artisanData.quote || artisanData.bio,
    story: artisanData.story || artisanData.bio,
    specialties: artisanData.specialties || [
      "Handcrafted Form",
      "Natural Materials",
      "Ancestral Heritage",
    ],
    processSteps: steps,
    moments,
    products: productsList,
    posts: [
      {
        id: `${artId}-post-1`,
        date: "2 days ago",
        caption: artisanData.quote
          ? `"${artisanData.quote}" — Live moments from our workshop in ${artisanData.city}.`
          : `Working on newly shaped creations right here in our workshop in ${artisanData.city}.`,
        image: artisanData.workImage1 || artisanData.studioImage,
        likes: Math.max(140, Math.round(followersNum * 0.14)),
        comments: Math.max(12, Math.round(followersNum * 0.02)),
      },
    ],
  };
}

export default function ArtisanDetailsPage({
  artisanId,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onOpenProductModal,
  onNavigate,
  onGoBack,
  showToast,
}) {
  const { t } = useLanguage();

  // 1. DYNAMICALLY RESOLVE ACTIVE ARTISAN
  const artisan = useMemo(() => {
    if (!artisanId) {
      const defaultFound =
        artisans.find((a) => a.id === "arjun-mehta") || artisans[0];
      return formatArtisanProfile(defaultFound);
    }

    const query = String(artisanId).toLowerCase().trim();

    let found = artisans.find((a) => a.id?.toLowerCase() === query);

    if (!found) {
      found = artisans.find(
        (a) =>
          a.name.toLowerCase() === query ||
          a.name.toLowerCase().replace(/\s+/g, "-") === query ||
          a.name.toLowerCase().includes(query) ||
          query.includes(a.name.toLowerCase()) ||
          (a.handle &&
            a.handle.toLowerCase().replace("@", "") === query.replace("@", "")),
      );
    }

    if (!found) {
      found = artisans.find((a) => a.id === "arjun-mehta") || artisans[0];
    }

    return formatArtisanProfile(found);
  }, [artisanId]);

  // 2. DYNAMICALLY GENERATE SIDEBAR SUGGESTED MAKERS
  const suggestedMakers = useMemo(() => {
    return artisans
      .filter((a) => a.id !== artisan?.id && a.name !== artisan?.name)
      .slice(0, 3)
      .map((a) => ({
        id: a.id,
        name: a.name,
        handle:
          a.handle || `@${a.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        verified: true,
        avatar: a.avatar,
      }));
  }, [artisan?.id, artisan?.name]);

  const { getPageState, savePageState } = useNavigation();
  const initialSavedTab =
    artisan?.id && getPageState
      ? getPageState(`artisan_${artisan.id}`)?.activeTab
      : null;

  // 3. INTERACTIVE COMPONENT STATES
  const [activeTab, setActiveTab] = useState(initialSavedTab || "Products");
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState(() => new Set(["Products"]));
  const tabLoadingTimeoutRef = useRef(null);
  const tabScrollPositionsRef = useRef({});
  const tabsAnchorRef = useRef(null);
  const tabsNavRef = useRef(null);

  // Instantly align viewport to the START of the selected tab's content directly below sticky header (no disorienting scroll animation)
  const scrollToTabStart = useCallback((behavior = "instant") => {
    if (typeof window === "undefined") return;

    // Dynamically measure fixed header height across Desktop, Tablet, and Mobile
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

      // Position the sticky tabs bar and the beginning of the tab content right under the fixed header
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

  // Passively record scroll position for the currently active tab
  useEffect(() => {
    const handleScroll = () => {
      if (isTabLoading) return;
      const currentScrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0;
      tabScrollPositionsRef.current[activeTab] = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab, isTabLoading]);

  const isTabSwitchingRef = useRef(false);

  const handleTabChange = useCallback(
    (newTab) => {
      if (newTab === activeTab && !isTabLoading) {
        // If clicking the current tab again, focus to start of content
        scrollToTabStart("instant");
        return;
      }

      // 1. Mark tab as actively switching to block any premature infinite scroll triggers
      isTabSwitchingRef.current = true;
      setTimeout(() => {
        isTabSwitchingRef.current = false;
      }, 600);

      // 2. Save scroll position of current active tab before switching
      const currentScrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0;
      tabScrollPositionsRef.current[activeTab] = currentScrollY;

      if (tabLoadingTimeoutRef.current) {
        clearTimeout(tabLoadingTimeoutRef.current);
      }

      setActiveTab(newTab);

      if (savePageState && artisan?.id) {
        savePageState(`artisan_${artisan.id}`, {
          activeTab: newTab,
          tabScrolls: tabScrollPositionsRef.current,
        });
      }

      const savedPosition = tabScrollPositionsRef.current[newTab];

      // 3. Only show 3-second skeleton on FIRST visit to this tab
      if (!loadedTabs.has(newTab)) {
        setIsTabLoading(true);
        scrollToTabStart("instant");
        tabLoadingTimeoutRef.current = setTimeout(() => {
          setIsTabLoading(false);
          setLoadedTabs((prev) => new Set([...prev, newTab]));
        }, 3000);
      } else {
        // 4. Tab was already visited: switch instantly & restore exact previous scroll position
        setIsTabLoading(false);
        if (savedPosition !== undefined && savedPosition !== null) {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: savedPosition,
              behavior: "instant",
            });
          });
        } else {
          scrollToTabStart("instant");
        }
      }
    },
    [
      activeTab,
      isTabLoading,
      loadedTabs,
      scrollToTabStart,
      savePageState,
      artisan?.id,
    ],
  );

  useEffect(() => {
    return () => {
      if (tabLoadingTimeoutRef.current) {
        clearTimeout(tabLoadingTimeoutRef.current);
      }
    };
  }, []);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(
    artisan?.followersCount || 2450,
  );
  const [followingSuggestedIds, setFollowingSuggestedIds] = useState({});
  const rightSidebarRef = useRef(null);

  // Inquiry Modal State
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  // State for Artisan Products Infinite Scroll & Skeletons
  const PAGE_SIZE = 6;
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const sentinelRef = useRef(null);

  const artisanProducts = useMemo(() => {
    return artisan?.products || [];
  }, [artisan]);

  const totalFilteredCount = artisanProducts.length;

  const visibleProducts = useMemo(() => {
    return artisanProducts.slice(0, Math.min(visibleCount, totalFilteredCount));
  }, [artisanProducts, visibleCount, totalFilteredCount]);

  const hasMore = visibleProducts.length < totalFilteredCount;

  // Reset scroll, followers, & pagination on artisan switch
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setFollowersCount(artisan?.followersCount || 2450);
    setIsFollowing(false);
    setActiveTab("Products");
    setLoadedTabs(new Set(["Products"]));
    tabScrollPositionsRef.current = {};
    setIsTabLoading(false);
    setIsFilterLoading(true);
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
    isLoadingMoreRef.current = false;
    isTabSwitchingRef.current = false;

    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [artisan?.id]);

  // Progressive batch loading handler with skeleton cards
  const loadNextRecords = useCallback(() => {
    if (isLoadingMoreRef.current || !hasMore || isTabSwitchingRef.current) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalFilteredCount));
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
    }, 550);
  }, [hasMore, totalFilteredCount]);

  // IntersectionObserver sentinel near the bottom of list (with mount/tab-switch protection)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || activeTab !== "Products" || isTabLoading) return;

    let isInitialMount = true;
    const initTimer = setTimeout(() => {
      isInitialMount = false;
    }, 500);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !isInitialMount &&
          !isTabSwitchingRef.current &&
          !isLoadingMoreRef.current
        ) {
          loadNextRecords();
        }
      },
      { rootMargin: "60px" },
    );

    observer.observe(sentinel);
    return () => {
      clearTimeout(initTimer);
      observer.disconnect();
    };
  }, [hasMore, loadNextRecords, activeTab, isTabLoading]);

  const resetAllFilters = useCallback(() => {
    setVisibleCount(PAGE_SIZE);
    setIsFilterLoading(false);
  }, []);

  // Dynamic 2-Way Sticky Scroll for Right Sidebar (Desktop mode > 1024px)
  useEffect(() => {
    const sidebar = rightSidebarRef.current;
    if (!sidebar) return;

    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let mode = "stick-top"; // 'stick-top' | 'stick-bottom' | 'relative'
    const HEADER_OFFSET = 88;
    const BOTTOM_SPACING = 24;

    const handleScroll = () => {
      if (typeof window === "undefined") return;

      // Disable on tablet/mobile where layout collapses to single column (<= 1024px)
      if (window.innerWidth <= 1024) {
        sidebar.style.position = "";
        sidebar.style.top = "";
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      const viewportHeight = window.innerHeight;
      const sidebarHeight = sidebar.offsetHeight;

      // If sidebar fits entirely in viewport, keep cleanly stuck to top
      if (sidebarHeight <= viewportHeight - HEADER_OFFSET - BOTTOM_SPACING) {
        sidebar.style.position = "sticky";
        sidebar.style.top = `${HEADER_OFFSET}px`;
        lastScrollY = currentScrollY;
        return;
      }

      const sidebarRect = sidebar.getBoundingClientRect();
      const parentRect = sidebar.parentElement
        ? sidebar.parentElement.getBoundingClientRect()
        : null;
      if (!parentRect) {
        lastScrollY = currentScrollY;
        return;
      }

      const minTopSticky = viewportHeight - sidebarHeight - BOTTOM_SPACING;

      if (currentScrollY <= HEADER_OFFSET) {
        // At or near page top: stick to normal starting position
        mode = "stick-top";
        sidebar.style.position = "sticky";
        sidebar.style.top = `${HEADER_OFFSET}px`;
      } else if (scrollDelta > 0) {
        // Scrolling DOWN
        if (mode === "stick-top") {
          // Release from top-sticky so sidebar moves naturally with the page
          mode = "relative";
          const relativeTop = Math.max(0, sidebarRect.top - parentRect.top);
          sidebar.style.position = "relative";
          sidebar.style.top = `${relativeTop}px`;
        } else if (mode === "relative") {
          // Check if footer/bottom reached viewport bottom boundary
          if (sidebarRect.top <= minTopSticky) {
            mode = "stick-bottom";
            sidebar.style.position = "sticky";
            sidebar.style.top = `${minTopSticky}px`;
          }
        }
      } else if (scrollDelta < 0) {
        // Scrolling UP
        if (mode === "stick-bottom") {
          // Release from bottom-sticky so sidebar moves down with the page
          mode = "relative";
          const relativeTop = Math.max(0, sidebarRect.top - parentRect.top);
          sidebar.style.position = "relative";
          sidebar.style.top = `${relativeTop}px`;
        } else if (mode === "relative") {
          // Check if top reached header offset
          if (sidebarRect.top >= HEADER_OFFSET) {
            mode = "stick-top";
            sidebar.style.position = "sticky";
            sidebar.style.top = `${HEADER_OFFSET}px`;
          }
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [artisan?.id, activeTab]);

  // Main Artisan Follow Toggle
  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount((prev) => (nextState ? prev + 1 : prev - 1));

    if (showToast) {
      showToast(
        nextState
          ? `You are now following ${artisan.name}`
          : `Unfollowed ${artisan.name}`,
      );
    }
  };

  // Sidebar Suggested Maker Follow Toggle
  const handleToggleSuggestedFollow = (makerId, makerName) => {
    setFollowingSuggestedIds((prev) => {
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

  // Share Profile Handler
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${artisan.name} • Craftinator`,
          text: `Discover handcrafted works by ${artisan.name} on Craftinator`,
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

  // Submit Studio Inquiry Form
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryMessage.trim()) return;

    if (showToast) {
      showToast(`Your message has been sent to ${artisan.name}'s studio!`);
    }

    setInquiryName("");
    setInquiryEmail("");
    setInquiryMessage("");
    setIsInquiryOpen(false);
  };

  if (!artisan) return null;

  return (
    <main className="artisan-page-root animate-fade-in">
      <div className="ap-page-container">
        {/* Breadcrumb Navigation - ALWAYS AT THE VERY TOP ACROSS ALL MODES */}
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
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() =>
              onNavigate ? onNavigate("/makers") : onGoBack && onGoBack()
            }
          >
            {t("nav_artisans", "Artisans")}
          </button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{artisan.name}</span>
        </nav>

        {/* ============================================================
            2. MAIN 2-COLUMN LAYOUT (Screenshot 1)
            ============================================================ */}
        <div className="ap-layout-grid">
          {/* ----------------------------------------------------------
              LEFT COLUMN: Profile Card, Tabs & Harmonized Sections
              ---------------------------------------------------------- */}
          <div className="ap-main-column">
            {/* PROFILE CARD (Screenshot 1) */}
            <section className="ap-profile-card">
              {/* Banner Image */}
              <div className="ap-profile-banner">
                <img
                  src={artisan.banner}
                  alt={`${artisan.name} Studio Banner`}
                  loading="eager"
                />
              </div>

              {/* Avatar & Action Buttons Row (Overlaps Banner) */}
              <div className="ap-profile-actions-bar">
                <div className="ap-profile-avatar-box">
                  <img src={artisan.avatar} alt={artisan.name} />
                </div>

                <div className="ap-profile-btns-group">
                  <button
                    className="ap-message-btn"
                    onClick={() => setIsInquiryOpen(true)}
                    aria-label="Send message to studio"
                    title="Send message"
                  >
                    <MessageSquare size={18} />
                  </button>

                  <button
                    className="ap-share-btn"
                    onClick={handleShare}
                    aria-label="Share profile"
                    title="Share profile"
                  >
                    <Share2 size={18} />
                  </button>

                  <button
                    className={`ap-follow-pill-btn ${isFollowing ? "following" : ""}`}
                    onClick={handleToggleFollow}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>

              {/* Profile Details Body */}
              <div className="ap-profile-body">
                {/* Name & Verified Badge */}
                <div className="ap-profile-name-row">
                  <h1 className="ap-profile-name">{artisan.name}</h1>
                  <CheckCircle2
                    size={20}
                    className="ap-verified-check-icon"
                    fill="#2563EB"
                    color="#FFFFFF"
                  />
                </div>

                {/* Handle */}
                <div className="ap-profile-handle">{artisan.handle}</div>

                {/* Brand Tag Pill & Specialty Italics */}
                <div className="ap-brand-tag-row">
                  <span className="ap-brand-pill">{artisan.brandName}</span>
                  <span className="ap-craft-desc-italics">
                    {artisan.craftSpecialty}
                  </span>
                </div>

                {/* Bio */}
                <p className="ap-profile-bio">{artisan.bio}</p>

                {/* Meta Row: Location, Website, Joined Year, Rating */}
                <div className="ap-profile-meta-row">
                  <div className="ap-meta-detail">
                    <MapPin size={15} />
                    <span>
                      {artisan.city}, {artisan.state}
                    </span>
                  </div>

                  {artisan.website && (
                    <div className="ap-meta-detail ap-meta-website">
                      <Globe size={15} />
                      <a
                        href={`https://${artisan.website.replace(/^https?:\/\//, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ap-meta-link"
                      >
                        {artisan.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}

                  <div className="ap-meta-detail">
                    <Calendar size={15} />
                    <span>Joined {artisan.joinedYear}</span>
                  </div>

                  <div className="ap-meta-detail">
                    <Star
                      size={15}
                      className="ap-meta-rating-star"
                      fill="#D97706"
                      color="#D97706"
                    />
                    <span className="ap-meta-rating-text">
                      {artisan.rating}
                    </span>
                    <span>Rating ( {artisan.reviewsCount} Reviews )</span>
                  </div>
                </div>

                {/* Stats Row: Following, Followers, Creations & Reviews */}
                <div className="ap-profile-stats-row">
                  <div className="ap-stat-item-inline">
                    <span className="ap-stat-num">
                      {artisan.followingCount}
                    </span>
                    <span className="ap-stat-lbl">Following</span>
                  </div>

                  <div className="ap-stat-item-inline">
                    <span className="ap-stat-num">
                      {followersCount.toLocaleString("en-IN")}
                    </span>
                    <span className="ap-stat-lbl">Followers</span>
                  </div>

                  <div className="ap-stat-item-inline">
                    <span className="ap-stat-num">
                      {artisan.creationsCount}
                    </span>
                    <span className="ap-stat-lbl">Creations</span>
                  </div>
                </div>
              </div>
            </section>

            {/* TABS ANCHOR FOR PRECISION SCROLL TARGETING */}
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

            {/* NAVIGATION TABS */}
            <nav
              ref={tabsNavRef}
              className="ap-nav-tabs-bar"
              aria-label="Artisan profile sections navigation"
            >
              <button
                type="button"
                className={`ap-nav-tab-btn ${activeTab === "Products" ? "active" : ""}`}
                onClick={() => handleTabChange("Products")}
              >
                Products ({artisan.creationsCount})
              </button>

              <button
                type="button"
                className={`ap-nav-tab-btn ${activeTab === "About" ? "active" : ""}`}
                onClick={() => handleTabChange("About")}
              >
                About & Craft Process
              </button>

              <button
                type="button"
                className={`ap-nav-tab-btn ${activeTab === "Posts" ? "active" : ""}`}
                onClick={() => handleTabChange("Posts")}
              >
                Studio Feed ({artisan.posts?.length || 1})
              </button>
            </nav>

            {/* TAB CONTENT & SKELETON TRANSITION STATES */}
            {isTabLoading ? (
              <div
                className="animate-fade-in ap-tab-content-pane"
                aria-live="polite"
                aria-busy="true"
              >
                {activeTab === "Products" && (
                  <div className="ap-tab-skeleton-wrapper">
                    <div
                      className="skel-section-header align-left"
                      style={{ marginBottom: "1.75rem" }}
                    >
                      <div className="skel-block skel-eyebrow" />
                      <div
                        className="skel-block skel-title"
                        style={{ width: "min(340px, 70%)" }}
                      />
                      <div
                        className="skel-block skel-subtitle"
                        style={{ width: "min(460px, 90%)" }}
                      />
                    </div>
                    <div className="product-grid shop-product-grid">
                      <ProductCardSkeleton count={6} />
                    </div>
                  </div>
                )}

                {activeTab === "About" && (
                  <div className="ap-tab-skeleton-wrapper">
                    <div
                      className="skel-section-header align-left"
                      style={{ marginBottom: "1.75rem" }}
                    >
                      <div className="skel-block skel-eyebrow" />
                      <div
                        className="skel-block skel-title"
                        style={{ width: "min(380px, 80%)" }}
                      />
                    </div>
                    <div
                      className="skel-block"
                      style={{
                        width: "100%",
                        height: "240px",
                        borderRadius: "var(--radius-lg)",
                        marginBottom: "1.75rem",
                      }}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "1.25rem",
                        marginBottom: "1.75rem",
                      }}
                    >
                      <div
                        className="skel-block"
                        style={{
                          height: "160px",
                          borderRadius: "var(--radius-md)",
                        }}
                      />
                      <div
                        className="skel-block"
                        style={{
                          height: "160px",
                          borderRadius: "var(--radius-md)",
                        }}
                      />
                      <div
                        className="skel-block"
                        style={{
                          height: "160px",
                          borderRadius: "var(--radius-md)",
                        }}
                      />
                    </div>
                    <div
                      className="skel-block"
                      style={{
                        width: "100%",
                        height: "180px",
                        borderRadius: "var(--radius-md)",
                      }}
                    />
                  </div>
                )}

                {activeTab === "Posts" && (
                  <div className="ap-tab-skeleton-wrapper">
                    <div
                      className="skel-section-header align-left"
                      style={{ marginBottom: "1.75rem" }}
                    >
                      <div className="skel-block skel-eyebrow" />
                      <div
                        className="skel-block skel-title"
                        style={{ width: "min(300px, 70%)" }}
                      />
                    </div>
                    <div
                      className="skel-block"
                      style={{
                        width: "100%",
                        height: "380px",
                        borderRadius: "var(--radius-lg)",
                        marginBottom: "1.5rem",
                      }}
                    />
                    <div
                      className="skel-block"
                      style={{
                        width: "100%",
                        height: "260px",
                        borderRadius: "var(--radius-lg)",
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* TAB CONTENT: PRODUCTS */}
                {activeTab === "Products" && (
                  <div className="animate-fade-in ap-tab-content-pane">
                    {/* SECTION 1: Artisan Products Catalog */}
                    <section className="ap-tab-section ap-products-section">
                      <div className="ap-tab-section-header">
                        <div className="ap-eyebrow-row">
                          <span className="ap-section-eyebrow">
                            Studio Catalog
                          </span>
                          <span className="ap-count-badge">
                            {totalFilteredCount} Pieces
                          </span>
                        </div>
                        <h2 className="ap-section-title">
                          Handcrafted by {artisan.name}
                        </h2>
                        <p className="ap-section-subtitle">
                          Authentic creations originating from {artisan.city},{" "}
                          {artisan.state}. Individually shaped by hand.
                        </p>
                      </div>

                      {/* Primary Product Grid with Skeleton Loading States */}
                      {isFilterLoading ? (
                        <div
                          className="product-grid shop-product-grid"
                          aria-label="Loading products"
                        >
                          <ProductCardSkeleton count={8} />
                        </div>
                      ) : visibleProducts.length > 0 ? (
                        <>
                          <div className="product-grid shop-product-grid">
                            {visibleProducts.map((product) => {
                              const isWishlisted = wishlist.includes(
                                product.id,
                              );
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
                            {isLoadingMore && <ProductCardSkeleton count={6} />}
                          </div>

                          {/* Infinite Scroll Sentinel Element */}
                          <div
                            ref={sentinelRef}
                            className="infinite-scroll-sentinel"
                            aria-hidden="true"
                          />

                          {/* Small Unobtrusive Loading Indicator & Load More Action */}
                          {isLoadingMore ? (
                            <div
                              className="infinite-loading-indicator"
                              role="status"
                              aria-live="polite"
                            >
                              <Loader2 size={19} className="infinite-spinner" />
                              <span>Loading more Pieces...</span>
                            </div>
                          ) : (
                            hasMore && (
                              <div
                                className="text-center"
                                style={{
                                  marginTop: "1.75rem",
                                  marginBottom: "1.25rem",
                                }}
                              >
                                <button
                                  className="btn btn-secondary"
                                  onClick={loadNextRecords}
                                  style={{
                                    minWidth: "240px",
                                    padding: "0.75rem 1.75rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  Load More Pieces (
                                  {totalFilteredCount - visibleProducts.length}{" "}
                                  remaining)
                                </button>
                              </div>
                            )
                          )}

                          {/* Natural End of Catalog Indicator */}
                          {!hasMore && visibleProducts.length > 0 && (
                            <div className="infinite-end-indicator">
                              <span className="end-divider-line" />
                              <span className="end-badge">
                                {t("shop_showing_all", "Showing all")} (
                                {totalFilteredCount})
                              </span>
                              <span className="end-divider-line" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className="shop-no-results text-center"
                          style={{ padding: "3rem 0", width: "100%" }}
                        >
                          <h3
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "1.4rem",
                              marginBottom: "0.5rem",
                              color: "var(--text-primary)",
                            }}
                          >
                            {t("shop_no_products", "No creations found")}
                          </h3>
                          <p
                            style={{
                              color: "var(--text-muted)",
                              marginBottom: "1.25rem",
                              fontSize: "0.92rem",
                            }}
                          >
                            {t("shop_reset_filters", "Reset filters")}
                          </p>
                          <button
                            className="btn btn-primary"
                            onClick={resetAllFilters}
                          >
                            {t("shop_reset_filters", "Reset filters")}
                          </button>
                        </div>
                      )}
                    </section>

                    {/* Section Divider Line (Matching /shop & /home styling) */}
                    <div className="ap-section-divider">
                      <span className="ap-divider-line" />
                      <span className="ap-divider-text">
                        Signature Line Collection
                      </span>
                      <span className="ap-divider-line" />
                    </div>

                    {/* SECTION 2: Dark Feature Collection Banner */}
                    <section className="ap-tab-section ap-signature-section">
                      <div className="ap-dark-collection-banner">
                        <div>
                          <h3 className="ap-dark-banner-title">
                            The {artisan.brandName} Signature Line
                          </h3>
                          <button
                            className="ap-btn-shop-collection"
                            onClick={() => onNavigate && onNavigate("/shop")}
                          >
                            <span>Explore Full Catalog</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>

                        <div className="ap-dark-banner-thumbs">
                          {artisan.products.slice(0, 3).map((p, idx) => (
                            <div key={idx} className="ap-dark-thumb-item">
                              <img src={p.image} alt={p.name} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {/* TAB CONTENT: ABOUT & PROCESS (Screenshot 2 Harmonized) */}
                {activeTab === "About" && (
                  <div className="animate-fade-in ap-tab-content-pane">
                    {/* Section 1: Meet the Maker Card */}
                    <section className="ap-meet-card-section">
                      <div className="ap-meet-card">
                        <div className="ap-meet-media">
                          <img
                            src={artisan.banner}
                            alt={`${artisan.name} at work`}
                          />
                        </div>

                        <div className="ap-meet-content">
                          <span className="ap-meet-eyebrow">
                            Meet {artisan.name.split(" ")[0]}
                          </span>
                          <h2 className="ap-meet-title">
                            Craft, patience, and human touch.
                          </h2>
                          <p className="ap-meet-desc">{artisan.story}</p>

                          <div className="ap-meet-meta-row">
                            <div className="ap-meet-meta-item">
                              <MapPin size={18} className="ap-meet-meta-icon" />
                              <div>
                                <div className="ap-meta-label">
                                  {artisan.city}
                                </div>
                                <div className="ap-meta-sub">
                                  Studio Workshop
                                </div>
                              </div>
                            </div>

                            <div className="ap-meet-meta-item">
                              <Sparkles
                                size={18}
                                className="ap-meet-meta-icon"
                              />
                              <div>
                                <div className="ap-meta-label">
                                  {artisan.craftSpecialty.split("&")[0].trim()}
                                </div>
                                <div className="ap-meta-sub">
                                  Est. {artisan.joinedYear}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Section Divider */}
                    <div className="ap-section-divider">
                      <span className="ap-divider-line" />
                      <span className="ap-divider-text">
                        Studio Specifications
                      </span>
                      <span className="ap-divider-line" />
                    </div>

                    {/* Section 2: About Specs Surface */}
                    <section className="ap-surface-container">
                      <div
                        className="ap-tab-section-header"
                        style={{ marginBottom: "1.25rem" }}
                      >
                        <div className="ap-eyebrow-row">
                          <span className="ap-section-eyebrow">
                            Atelier Standards
                          </span>
                        </div>
                        <h3
                          className="ap-section-title"
                          style={{ fontSize: "1.3rem" }}
                        >
                          Studio & Craft Details
                        </h3>
                      </div>

                      <div className="ap-about-specs-grid">
                        <div className="ap-spec-item">
                          <Sparkles size={16} className="ap-spec-icon" />
                          <div>
                            <div className="ap-spec-key">Craft Discipline</div>
                            <div className="ap-spec-val">{artisan.craft}</div>
                          </div>
                        </div>

                        <div className="ap-spec-item">
                          <Clock size={16} className="ap-spec-icon" />
                          <div>
                            <div className="ap-spec-key">Experience</div>
                            <div className="ap-spec-val">
                              {artisan.yearsOfExperience} Years
                            </div>
                          </div>
                        </div>

                        <div className="ap-spec-item">
                          <MapPin size={16} className="ap-spec-icon" />
                          <div>
                            <div className="ap-spec-key">Workshop Location</div>
                            <div className="ap-spec-val">
                              {artisan.city}, {artisan.state}
                            </div>
                          </div>
                        </div>

                        <div className="ap-spec-item">
                          <Briefcase size={16} className="ap-spec-icon" />
                          <div>
                            <div className="ap-spec-key">Specialty</div>
                            <div className="ap-spec-val">
                              {artisan.craftSpecialty}
                            </div>
                          </div>
                        </div>

                        <div className="ap-spec-item">
                          <HeartHandshake size={16} className="ap-spec-icon" />
                          <div>
                            <div className="ap-spec-key">Studio Brand</div>
                            <div className="ap-spec-val">
                              {artisan.brandName}
                            </div>
                          </div>
                        </div>

                        <div className="ap-spec-item">
                          <Layers size={16} className="ap-spec-icon" />
                          <div>
                            <div className="ap-spec-key">Materials Used</div>
                            <div className="ap-spec-val">
                              100% Sustainable & Hand-sourced
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Section Divider */}
                    <div className="ap-section-divider">
                      <span className="ap-divider-line" />
                      <span className="ap-divider-text">
                        Ancestral Craft Process
                      </span>
                      <span className="ap-divider-line" />
                    </div>

                    {/* Section 3: How It's Made: 5-Step Process */}
                    <section className="ap-how-section">
                      <div className="ap-how-header">
                        <h3 className="ap-how-title">How It's Made</h3>
                        <span className="ap-how-subtitle">
                          5-step artisan process from raw material to finished
                          treasure
                        </span>
                      </div>

                      <div className="ap-how-grid">
                        {artisan.processSteps.map((step, idx) => (
                          <div key={idx} className="ap-how-card">
                            <div className="ap-how-media">
                              <img
                                src={step.image}
                                alt={step.name}
                                loading="lazy"
                              />
                            </div>
                            <div className="ap-how-body">
                              <h4 className="ap-how-step-name">{step.name}</h4>
                              <p className="ap-how-step-desc">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Section Divider */}
                    <div className="ap-section-divider">
                      <span className="ap-divider-line" />
                      <span className="ap-divider-text">Studio Moments</span>
                      <span className="ap-divider-line" />
                    </div>

                    {/* Section 4: Studio Moments Photo Strip */}
                    <section className="ap-moments-section">
                      <h3
                        className="ap-how-title"
                        style={{ marginBottom: "1rem" }}
                      >
                        Studio Moments
                      </h3>
                      <div className="ap-moments-strip">
                        {artisan.moments.map((img, idx) => (
                          <div key={idx} className="ap-moment-tile">
                            <img
                              src={img}
                              alt={`Studio moment ${idx + 1}`}
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {/* TAB CONTENT: STUDIO FEED */}
                {activeTab === "Posts" && (
                  <div className="animate-fade-in ap-studio-feed-container">
                    <div className="ap-tab-section-header">
                      <div className="ap-eyebrow-row">
                        <span className="ap-section-eyebrow">
                          Studio Dispatches
                        </span>
                        <span className="ap-count-badge">
                          {artisan.posts?.length || 1} Updates
                        </span>
                      </div>
                      <h2 className="ap-section-title">
                        Live From {artisan.name}'s Workshop
                      </h2>
                      <p className="ap-section-subtitle">
                        Behind-the-scenes progress, freshly fired or shaped
                        works, and atelier notes.
                      </p>
                    </div>

                    {artisan.posts?.map((post) => (
                      <div
                        key={post.id}
                        className="ap-profile-card ap-feed-post-card"
                      >
                        <div className="ap-post-header-row">
                          <div className="ap-post-author-box">
                            <img
                              src={artisan.avatar}
                              alt={artisan.name}
                              className="ap-post-author-avatar"
                            />
                            <div>
                              <div className="ap-post-author-name-row">
                                <span>{artisan.name}</span>
                                <CheckCircle2
                                  size={14}
                                  fill="#2563EB"
                                  color="#FFFFFF"
                                />
                              </div>
                              <div className="ap-post-date">{post.date}</div>
                            </div>
                          </div>
                          <MoreHorizontal size={18} color="var(--text-muted)" />
                        </div>

                        <p className="ap-post-caption">{post.caption}</p>

                        {post.image && (
                          <div className="ap-post-image-wrap">
                            <img
                              src={post.image}
                              alt="Studio update"
                              className="ap-post-image"
                            />
                          </div>
                        )}

                        <div className="ap-post-actions-row">
                          <span>♡ {post.likes} Likes</span>
                          <span>💬 {post.comments} Comments</span>
                          <span className="ap-post-verified-badge">
                            Artisan Verified Post
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ----------------------------------------------------------
              RIGHT COLUMN: Sidebar ("You might like" & "Trending in Crafting")
              ---------------------------------------------------------- */}
          <aside ref={rightSidebarRef} className="ap-sidebar-column">
            {/* SIDEBAR CARD 1: You might like (Screenshot 1) */}
            <div className="ap-sidebar-card">
              <h2 className="ap-sidebar-card-title">You might like</h2>

              <div className="ap-suggested-makers-list">
                {suggestedMakers.map((maker) => (
                  <div key={maker.id} className="ap-suggested-maker-row">
                    <div
                      className="ap-sugg-author-info"
                      onClick={() =>
                        onNavigate && onNavigate(`/artisan?id=${maker.id}`)
                      }
                      title={`View ${maker.name}'s profile`}
                    >
                      <img
                        src={maker.avatar}
                        alt={maker.name}
                        className="ap-sugg-avatar"
                      />
                      <div className="ap-sugg-name-col">
                        <div className="ap-sugg-name-row">
                          <span className="ap-sugg-name">{maker.name}</span>
                          {maker.verified && (
                            <CheckCircle2
                              size={13}
                              fill="#2563EB"
                              color="#FFFFFF"
                            />
                          )}
                        </div>
                        <span className="ap-sugg-handle">{maker.handle}</span>
                      </div>
                    </div>

                    <button
                      className={`ap-sugg-follow-btn ${followingSuggestedIds[maker.id] ? "following" : ""}`}
                      onClick={() =>
                        handleToggleSuggestedFollow(maker.id, maker.name)
                      }
                    >
                      {followingSuggestedIds[maker.id] ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="ap-sidebar-show-more-btn"
                onClick={() => onNavigate && onNavigate("/makers")}
              >
                Show more
              </button>
            </div>

            {/* SIDEBAR CARD 2: Trending in Crafting (Screenshot 1) */}
            <div className="ap-sidebar-card">
              <h2 className="ap-sidebar-card-title">Trending in Crafting</h2>

              <div className="ap-trending-tags-list">
                {trendingCrafts.map((trend, idx) => (
                  <div key={idx} className="ap-trending-tag-item">
                    <span className="ap-trend-category">{trend.category}</span>
                    <span
                      className="ap-trend-tag-name"
                      onClick={() => onNavigate && onNavigate("/shop")}
                    >
                      {trend.tag}
                    </span>
                    <span className="ap-trend-count">{trend.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDEBAR CARD 3: Studio Handcrafted Guarantee */}
            <div
              className="ap-sidebar-card"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  marginBottom: "0.65rem",
                }}
              >
                Craftinator Verified Studio
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  marginBottom: "0.85rem",
                }}
              >
                Every piece from {artisan.name}'s studio is made slowly and
                authentically with verifiable provenance.
              </p>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--accent-terracotta)",
                  fontWeight: 700,
                }}
              >
                ✓ Dispatches directly from {artisan.city}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ============================================================
          3. STUDIO DIRECT INQUIRY MODAL (Triggered by 💬 button)
          ============================================================ */}
      {isInquiryOpen && (
        <div className="ap-inquiry-modal" role="dialog" aria-modal="true">
          <div
            className="ap-inquiry-backdrop"
            onClick={() => setIsInquiryOpen(false)}
          />

          <div className="ap-inquiry-content animate-fade-in">
            <button
              className="ap-modal-close-btn"
              onClick={() => setIsInquiryOpen(false)}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <h3 className="ap-modal-title">Message {artisan.name}</h3>
            <p className="ap-modal-subtitle">
              Ask about custom commissions, dimensions, or custom order requests
              directly from {artisan.brandName}.
            </p>

            <form onSubmit={handleInquirySubmit}>
              <div className="ap-form-field">
                <label htmlFor="inquiry-name">Your Name</label>
                <input
                  id="inquiry-name"
                  type="text"
                  required
                  placeholder="e.g. Subham Roy"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                />
              </div>

              <div className="ap-form-field">
                <label htmlFor="inquiry-email">Email Address</label>
                <input
                  id="inquiry-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                />
              </div>

              <div className="ap-form-field">
                <label htmlFor="inquiry-msg">Your Message</label>
                <textarea
                  id="inquiry-msg"
                  required
                  placeholder={`Hi ${artisan.name}, I loved your handmade creations and wanted to ask...`}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="ap-form-submit-btn">
                Send Inquiry to Studio
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
