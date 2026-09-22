import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Heart,
  MessageCircle,
  MessageSquare,
  Bookmark,
  Plus,
  Search,
  MoreHorizontal,
  Home,
  Compass,
  Send,
  BarChart2,
  Settings,
  UserPlus,
  Check,
  X,
  ShoppingBag,
  Sparkles,
  Share2,
  Tag,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Bell,
  Rocket,
  BadgeCheck,
  User,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { communityPosts } from '../data/communityPosts';
import { artisans } from '../data/artisans';

const PAGE_SIZE = 8;

/* ============================================================
   POST SKELETON PLACEHOLDER COMPONENT (Shimmer Infinite Scroll)
   ============================================================ */
function PostSkeleton() {
  return (
    <div className="soc-post-card soc-skeleton-card animate-fade-in">
      {/* 1. Author Header Skeleton */}
      <div className="soc-post-author-row">
        <div className="soc-post-author-info">
          <div className="soc-skel-avatar soc-skel-shimmer" />
          <div className="soc-skel-author-lines">
            <div className="soc-skel-line soc-skel-name soc-skel-shimmer" />
            <div className="soc-skel-line soc-skel-sub soc-skel-shimmer" />
          </div>
        </div>
        <div className="soc-skel-circle soc-skel-shimmer" />
      </div>

      {/* 2. Media Image Skeleton (Exact 4:3 Aspect Ratio) */}
      <div className="soc-skel-media soc-skel-shimmer" />

      {/* 3. Product Box Skeleton (Optional lookalike) */}
      <div className="soc-skel-product-box">
        <div className="soc-skel-prod-thumb soc-skel-shimmer" />
        <div className="soc-skel-prod-meta">
          <div className="soc-skel-line soc-skel-prod-cat soc-skel-shimmer" />
          <div className="soc-skel-line soc-skel-prod-title soc-skel-shimmer" />
          <div className="soc-skel-line soc-skel-prod-price soc-skel-shimmer" />
        </div>
        <div className="soc-skel-prod-btn soc-skel-shimmer" />
      </div>

      {/* 4. Caption Skeleton Lines */}
      <div className="soc-post-caption-box">
        <div className="soc-skel-line soc-skel-text soc-skel-shimmer" style={{ width: '92%' }} />
        <div className="soc-skel-line soc-skel-text soc-skel-shimmer" style={{ width: '74%', marginTop: '0.45rem' }} />
        <div className="soc-skel-line soc-skel-text soc-skel-shimmer" style={{ width: '48%', marginTop: '0.45rem' }} />
      </div>

      {/* 5. Actions Footer Skeleton */}
      <div className="soc-post-actions-bar">
        <div className="soc-actions-left">
          <div className="soc-skel-btn soc-skel-shimmer" />
          <div className="soc-skel-btn soc-skel-shimmer" />
          <div className="soc-skel-btn soc-skel-shimmer" />
        </div>
        <div className="soc-skel-btn soc-skel-shimmer" />
      </div>
    </div>
  );
}

/* ============================================================
   INDIVIDUAL POST CARD COMPONENT
   Includes:
   - Consistent Aspect Ratio (Mobile, Tablet, Desktop)
   - Left / Right Interactive Image Slider (Touch swipe + Chevrons + Dots)
   - Conditional "View Product" Tagged Box
   - 120-Letter Caption Truncation with Expand/Collapse (...more / less)
   ============================================================ */
function PostCard({
  post,
  onToggleLike,
  onToggleSave,
  onOpenArtisanModal,
  onOpenProductModal,
  onNavigate,
  showToast,
  onFilterTag
}) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const images = post.images && post.images.length > 0 ? post.images : [post.mainImg || post.image];
  const hasMultiple = images.length > 1;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40 && hasMultiple) {
      setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -40 && hasMultiple) {
      setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Caption truncation logic (120 characters threshold)
  const isLongCaption = post.caption && post.caption.length > 120;
  const displayedCaption = isLongCaption && !isExpanded
    ? `${post.caption.slice(0, 120)}...`
    : post.caption;

  return (
    <article className="soc-post-card">
      
      {/* Top Shop / Craft Specialty Banner (Mobile Mode - Full Width) */}
      {post.authorRole && (
        <div
          className="soc-post-seller-strip"
          onClick={() => {
            if (onOpenArtisanModal) {
              onOpenArtisanModal({
                name: post.author,
                specialty: post.authorRole || 'Artisan Maker',
                image: post.avatar,
                location: 'Jaipur, India'
              });
            } else if (showToast) {
              showToast(`Viewing ${post.author}'s artisan shop`);
            }
          }}
          title={`View ${post.author}'s artisan shop`}
        >
          <span className="soc-post-author-badge" title={post.authorRole}>{post.authorRole}</span>
        </div>
      )}

      {/* 1. Post Author Header */}
      <div className="soc-post-author-row">
        <div
          className="soc-post-author-info"
          onClick={() => {
            if (onOpenArtisanModal) {
              onOpenArtisanModal({
                name: post.author,
                specialty: post.authorRole || 'Artisan Maker',
                image: post.avatar,
                location: 'Jaipur, India'
              });
            } else if (showToast) {
              showToast(`Viewing ${post.author}'s profile`);
            }
          }}
        >
          <img src={post.avatar} alt={post.author} className="soc-post-avatar" loading="lazy" />
          <div>
            <div className="soc-post-author-name-wrap">
              <h4 className="soc-post-name">{post.author}</h4>
              {post.authorRole && (
                <span className="soc-post-author-badge soc-post-author-badge-desktop">{post.authorRole}</span>
              )}
            </div>
            <div className="soc-post-meta-sub">
              <span className="soc-post-handle">{post.handle}</span>
              {post.timeAgo && (
                <>
                  <span className="soc-post-dot">•</span>
                  <span className="soc-post-time">{post.timeAgo}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          className="soc-post-more-btn"
          onClick={() => {
            if (showToast) showToast('Post options: Share, Copy link, Bookmark');
          }}
          aria-label="Post options"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* 2. Consistent Aspect-Ratio Image Slider / Carousel with Left & Right controls */}
      <div
        className="soc-media-slider-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="soc-media-slider-track"
          style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
        >
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="soc-media-slider-slide"
            >
              <img
                src={imgUrl}
                alt={`${post.author} craft presentation ${idx + 1}`}
                className="soc-media-fixed-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Counter Badge if multiple images */}
        {hasMultiple && (
          <div className="soc-slider-counter-badge">
            {currentImgIndex + 1}/{images.length}
          </div>
        )}

        {/* Left / Right Nav Arrows */}
        {hasMultiple && (
          <>
            <button
              type="button"
              className="soc-slider-arrow-btn soc-arrow-left"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="soc-slider-arrow-btn soc-arrow-right"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Pagination Dots */}
            <div className="soc-slider-dots-row">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`soc-slider-dot ${idx === currentImgIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIndex(idx);
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 3. Tagged "View Product" Box - Rendered ONLY if post has a linked product */}
      {post.product && (
        <div className="soc-product-card-attachment">
          <div className="soc-product-card-left">
            <img
              src={post.product.image}
              alt={post.product.name}
              className="soc-product-card-thumb"
              loading="lazy"
            />
            <div className="soc-product-card-meta">
              <div className="soc-product-card-tag-row">
                <span className="soc-product-card-cat">
                  <Tag size={11} style={{ marginRight: '3px' }} />
                  {post.product.category}
                </span>
                {post.product.badge && (
                  <span className="soc-product-card-badge">{post.product.badge}</span>
                )}
              </div>
              <h5 className="soc-product-card-title">{post.product.name}</h5>
              <div className="soc-product-card-price-row">
                <span className="soc-product-card-price">
                  ₹{typeof post.product.price === 'number' ? post.product.price.toLocaleString('en-IN') : post.product.price}
                </span>
                {post.product.rating && (
                  <span className="soc-product-card-rating">
                    <Star size={12} fill="#D97706" color="#D97706" />
                    <span>{post.product.rating}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="soc-view-product-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenProductModal) {
                onOpenProductModal(post.product);
              } else if (onNavigate) {
                onNavigate(`/product?id=${post.product.id}`);
              }
              if (showToast) {
                showToast(`Opening "${post.product.name}"`);
              }
            }}
            aria-label={`View product ${post.product.name}`}
          >
            <ShoppingBag size={15} />
            <span>View Product</span>
            <ArrowRight size={14} className="soc-view-prod-arrow" />
          </button>
        </div>
      )}

      {/* 4. Post Caption (Truncated at 120 letters + ...more / less toggle) & Hashtags */}
      <div className="soc-post-caption-box">
        <p className="soc-post-caption">
          {displayedCaption}
          {isLongCaption && (
            <button
              type="button"
              className="soc-caption-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? ' less' : ' more'}
            </button>
          )}
        </p>

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="soc-hashtags-row">
            {post.hashtags.map((ht, idx) => (
              <span
                key={idx}
                className="soc-hashtag-item"
                onClick={() => onFilterTag(ht)}
              >
                {ht}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 5. Actions Footer */}
      <div className="soc-post-actions-bar">
        <div className="soc-actions-left">
          <button
            type="button"
            className={`soc-action-btn ${post.isLiked ? 'liked' : ''}`}
            onClick={() => onToggleLike(post.id)}
            aria-label="Like post"
          >
            <Heart size={20} />
            <span>{post.likes}</span>
          </button>

          <button
            type="button"
            className="soc-action-btn"
            onClick={() => {
              if (showToast) showToast('Comment thread opened');
            }}
            aria-label="Comment on post"
          >
            <MessageCircle size={20} />
            <span>{post.comments}</span>
          </button>

          <button
            type="button"
            className="soc-action-btn"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              if (showToast) showToast('Post link copied to clipboard!');
            }}
            aria-label="Share post"
          >
            <Share2 size={18} />
          </button>
        </div>

        <button
          type="button"
          className={`soc-bookmark-btn ${post.isSaved ? 'saved' : ''}`}
          onClick={() => onToggleSave(post.id)}
          aria-label="Bookmark post"
          title={post.isSaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Bookmark size={20} />
        </button>
      </div>

    </article>
  );
}

/* ============================================================
   MAIN COMMUNITY PAGE COMPONENT
   ============================================================ */
function getTabFromUrl() {
  if (typeof window === 'undefined') return 'feed';
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab === 'saved' || tab === 'favorites') return 'favorites';
  if (tab === 'liked') return 'liked';
  if (tab === 'comment' || tab === 'comments') return 'comments';
  if (tab === 'feed' || tab === 'home') return 'feed';
  return 'feed';
}

export default function CommunityPage({
  onOpenArtisanModal,
  onOpenProductModal,
  onNavigate,
  showToast
}) {
  const { t } = useLanguage();
  const navigation = useNavigation ? useNavigation() : null;
  const navContextNavigate = navigation?.navigate;

  // Active Navigation Tab (Left Sidebar & URL Sync)
  const [activeNav, setActiveNav] = useState(() => getTabFromUrl());
  // Tab change skeleton shimmer loading state
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Set of tabs already visited in this session
  const visitedTabsRef = useRef(new Set([getTabFromUrl()]));
  // In-memory scroll coordinates per tab ('feed', 'favorites', 'liked', 'comments')
  const tabScrollMapRef = useRef({ [getTabFromUrl()]: 0 });

  /* Scroll-direction detection for Mobile/Tablet Quick Nav Strip */
  const [isNavStripVisible, setIsNavStripVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const isNavStripVisibleRef = useRef(true);

  useEffect(() => {
    isNavStripVisibleRef.current = isNavStripVisible;
  }, [isNavStripVisible]);

  // Passive scroll listener to continuously record scroll position of the current active tab
  useEffect(() => {
    const handleTabScroll = () => {
      if (typeof window === 'undefined') return;
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      tabScrollMapRef.current[activeNav] = currentScrollY;
    };
    window.addEventListener('scroll', handleTabScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleTabScroll);
  }, [activeNav]);

  useEffect(() => {
    const syncFromUrl = () => {
      const tab = getTabFromUrl();
      setActiveNav(tab);
      visitedTabsRef.current.add(tab);
      // On browser popstate navigation (Back / Forward), do NOT show blocking skeleton
      // so layout stays fully expanded and previous scroll position is restored immediately
      setIsTabLoading(false);
      // Keep mobile quick nav strip visible on back/forward navigation until user scrolls
      setIsNavStripVisible(true);
      isNavStripVisibleRef.current = true;
      if (typeof window !== 'undefined') {
        lastScrollYRef.current = window.scrollY || 0;
      }
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Feeds Filter Toggle (Middle Column: 'popular' | 'latest')
  const [feedFilter, setFeedFilter] = useState('popular');

  // Search Input State
  const [searchQuery, setSearchQuery] = useState('');

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const rightSidebarRef = useRef(null);

  // Posts Stream Data (Initialized with 104+ posts from data module)
  const [posts, setPosts] = useState(communityPosts);

  // Left Sidebar Contacts Data
  const contacts = [
    { id: 1, name: 'Julie Mendez', loc: 'Memphis, TN, US', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop', online: true },
    { id: 2, name: 'Marian Montgomery', loc: 'Newark, NJ, US', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop', online: true },
    { id: 3, name: 'Joyce Reid', loc: 'Fort Worth, TX, US', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop', online: false },
    { id: 4, name: 'Alice Franklin', loc: 'Springfield, MA, US', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop', online: true },
    { id: 5, name: 'Domingo Flores', loc: 'Honolulu, HI, US', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', online: true }
  ];

  // Right Sidebar Friend Requests Data
  const [requests, setRequests] = useState([
    { id: 1, name: 'Lauralee Quintero', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop' },
    { id: 2, name: 'Brittni Landoma', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' }
  ]);

  // Right Sidebar & In-Feed Suggestions Data (Powered by authentic master artisans)
  const [suggestions, setSuggestions] = useState(() =>
    artisans.map(a => ({
      ...a,
      loc: `${a.city}, ${a.state}`,
      followed: false
    }))
  );

  // In-Feed Suggested Creators Slider Ref & Handlers (Desktop & Tablet)
  const infeedSliderRef = useRef(null);

  const handleInfeedScrollPrev = () => {
    if (infeedSliderRef.current) {
      infeedSliderRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const handleInfeedScrollNext = () => {
    if (infeedSliderRef.current) {
      infeedSliderRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Reset infinite scroll count when filtering or searching
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeNav, feedFilter, searchQuery]);

  // Dynamic 2-Way Sticky Scroll for Right Sidebar (Desktop mode)
  useEffect(() => {
    const sidebar = rightSidebarRef.current;
    if (!sidebar) return;

    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let mode = 'stick-top'; // 'stick-top' | 'stick-bottom' | 'relative'
    const HEADER_OFFSET = 88;
    const BOTTOM_SPACING = 24;

    const handleScroll = () => {
      if (typeof window === 'undefined') return;

      // Disable on tablet/mobile where right sidebar is hidden or stacked
      if (window.innerWidth <= 1180) {
        sidebar.style.position = '';
        sidebar.style.top = '';
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      const viewportHeight = window.innerHeight;
      const sidebarHeight = sidebar.offsetHeight;

      // If sidebar fits entirely in the viewport, keep it cleanly stuck to the top
      if (sidebarHeight <= viewportHeight - HEADER_OFFSET - BOTTOM_SPACING) {
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${HEADER_OFFSET}px`;
        lastScrollY = currentScrollY;
        return;
      }

      const sidebarRect = sidebar.getBoundingClientRect();
      const parentRect = sidebar.parentElement ? sidebar.parentElement.getBoundingClientRect() : null;
      if (!parentRect) {
        lastScrollY = currentScrollY;
        return;
      }

      const minTopSticky = viewportHeight - sidebarHeight - BOTTOM_SPACING;

      if (currentScrollY <= HEADER_OFFSET) {
        // At or near page top: stick to normal starting position
        mode = 'stick-top';
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${HEADER_OFFSET}px`;
      } else if (scrollDelta > 0) {
        // Scrolling DOWN
        if (mode === 'stick-top') {
          // Release from top-sticky so sidebar moves naturally with the page
          mode = 'relative';
          const relativeTop = Math.max(0, sidebarRect.top - parentRect.top);
          sidebar.style.position = 'relative';
          sidebar.style.top = `${relativeTop}px`;
        } else if (mode === 'relative') {
          // Check if footer reached the bottom viewport boundary
          if (sidebarRect.top <= minTopSticky) {
            mode = 'stick-bottom';
            sidebar.style.position = 'sticky';
            sidebar.style.top = `${minTopSticky}px`;
          }
        }
      } else if (scrollDelta < 0) {
        // Scrolling UP
        if (mode === 'stick-bottom') {
          // Release from bottom-sticky so sidebar moves down with the page
          mode = 'relative';
          const relativeTop = Math.max(0, sidebarRect.top - parentRect.top);
          sidebar.style.position = 'relative';
          sidebar.style.top = `${relativeTop}px`;
        } else if (mode === 'relative') {
          // Check if top reached header offset
          if (sidebarRect.top >= HEADER_OFFSET) {
            mode = 'stick-top';
            sidebar.style.position = 'sticky';
            sidebar.style.top = `${HEADER_OFFSET}px`;
          }
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleTabSelect = (tabName) => {
    const targetTab = (tabName === 'home' || tabName === 'feed') ? 'feed' : tabName;
    const currentScroll = typeof window !== 'undefined' ? (window.scrollY || document.documentElement.scrollTop || 0) : 0;

    // Keep mobile quick navigation strip visible on any tab switch until user scrolls
    setIsNavStripVisible(true);
    isNavStripVisibleRef.current = true;

    // CASE 1: Clicking the ALREADY ACTIVE TAB -> Smoothly scroll to TOP & reset that tab's saved offset
    if (activeNav === targetTab) {
      tabScrollMapRef.current[targetTab] = 0;
      lastScrollYRef.current = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Save previous active tab's scroll position before leaving
    tabScrollMapRef.current[activeNav] = currentScroll;

    const isNewlyVisited = !visitedTabsRef.current.has(targetTab);
    const targetUrl = targetTab === 'feed' ? '/community?tab=feed' : `/community?tab=${targetTab}`;

    if (isNewlyVisited) {
      // CASE 2: NEW TAB (First time visiting this tab in this session)
      // -> Mark as visited
      visitedTabsRef.current.add(targetTab);
      tabScrollMapRef.current[targetTab] = 0;
      lastScrollYRef.current = 0;

      // -> Show skeleton shimmer state
      setIsTabLoading(true);
      setActiveNav(targetTab);

      // -> Navigate and reset strictly to TOP (0, 0)
      if (navContextNavigate) {
        navContextNavigate(targetUrl);
      } else if (onNavigate) {
        onNavigate(targetUrl);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // -> Reveal content smoothly after preparation delay (~380ms)
      setTimeout(() => {
        setIsTabLoading(false);
      }, 380);
    } else {
      // CASE 3: ALREADY VISITED TAB
      // -> Retrieve previously saved scroll position for this tab
      const savedScrollY = tabScrollMapRef.current[targetTab] || 0;
      lastScrollYRef.current = savedScrollY;

      // -> Do not block with skeleton so layout is immediately rendered
      setIsTabLoading(false);
      setActiveNav(targetTab);

      // -> Navigate with preserveScroll flag so global navigation doesn't force top (0)
      if (navContextNavigate) {
        navContextNavigate(targetUrl, { preserveScroll: true, targetScrollY: savedScrollY });
      } else if (onNavigate) {
        onNavigate(targetUrl);
      }

      // -> Restore exact previous position
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' });
      });
    }
  };

  // Handle Like
  const handleToggleLike = (postId) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          const currentLikesNum = parseInt(String(post.likes).replace(/[^0-9]/g, '')) || 0;
          const updatedLikes = isLiked ? (currentLikesNum + 1).toLocaleString() : Math.max(0, currentLikesNum - 1).toLocaleString();
          return { ...post, isLiked, likes: updatedLikes };
        }
        return post;
      })
    );
  };

  // Handle Save / Bookmark
  const handleToggleSave = (postId) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isSaved = !post.isSaved;
          if (showToast) showToast(isSaved ? 'Post saved to favorites ✨' : 'Removed from favorites');
          return { ...post, isSaved };
        }
        return post;
      })
    );
  };

  // Handle Accept/Decline Friend Request
  const handleRequestAction = (reqId, action) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
    if (showToast) {
      showToast(action === 'accept' ? 'Friend request accepted' : 'Request declined');
    }
  };

  // Handle Suggestion Add
  const handleToggleSuggestion = (sugId) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === sugId ? { ...s, followed: !s.followed } : s))
    );
    if (showToast) showToast('Following creator!');
  };

  // Filtered and Sorted Posts Computation
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Left navigation & mobile chip tab filters
    if (activeNav === 'favorites') {
      result = result.filter(p => p.isSaved);
    } else if (activeNav === 'liked') {
      result = result.filter(p => p.isLiked);
    } else if (activeNav === 'comments') {
      result = result.filter(p => {
        const count = parseInt(String(p.comments).replace(/[^0-9]/g, '')) || 0;
        return count > 0;
      });
    }

    // Search query filter across author, caption, handle, hashtags, and product title
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.author?.toLowerCase().includes(q) ||
        p.handle?.toLowerCase().includes(q) ||
        p.caption?.toLowerCase().includes(q) ||
        p.hashtags?.some(h => h.toLowerCase().includes(q)) ||
        p.product?.name?.toLowerCase().includes(q) ||
        p.product?.category?.toLowerCase().includes(q)
      );
    }

    // Sort order: Popular vs Latest
    if (feedFilter === 'popular') {
      result.sort((a, b) => {
        const likesA = parseInt(String(a.likes).replace(/[^0-9]/g, '')) || 0;
        const likesB = parseInt(String(b.likes).replace(/[^0-9]/g, '')) || 0;
        return likesB - likesA;
      });
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [posts, activeNav, searchQuery, feedFilter]);

  // Paginated visible posts for Infinite Scroll
  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  // IntersectionObserver Infinite Scroll Trigger
  useEffect(() => {
    if (visibleCount >= filteredPosts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredPosts.length));
            setIsLoadingMore(false);
          }, 450); // realistic smooth batch delay showing skeleton
        }
      },
      {
        threshold: 0.1,
        rootMargin: '250px'
      }
    );

    const el = sentinelRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [visibleCount, filteredPosts.length, isLoadingMore]);

  /* Scroll-direction detection for Mobile/Tablet Quick Nav Strip */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const SCROLL_THRESHOLD = 8; // Avoid micro-jitter / rubber-banding

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(
            0,
            window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
          );

          // 1. Always visible near top of page (page load / reload / top of feed)
          if (currentScrollY <= 60) {
            if (!isNavStripVisibleRef.current) {
              setIsNavStripVisible(true);
            }
            lastScrollYRef.current = currentScrollY;
            ticking = false;
            return;
          }

          const diff = currentScrollY - lastScrollYRef.current;

          // 2. Scrolling DOWN -> Smoothly show strip
          if (diff > SCROLL_THRESHOLD) {
            if (!isNavStripVisibleRef.current) {
              setIsNavStripVisible(true);
            }
            lastScrollYRef.current = currentScrollY;
          }
          // 3. Scrolling UP -> Smoothly hide strip
          else if (diff < -SCROLL_THRESHOLD) {
            if (isNavStripVisibleRef.current) {
              setIsNavStripVisible(false);
            }
            lastScrollYRef.current = currentScrollY;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="community-app-root animate-fade-in">
      
      {/* 3-COLUMN SOCIAL APP CONTAINER */}
      <div className="soc-app-grid">
        
        {/* ============================================================
            1. LEFT SIDEBAR (Sticky Card Container)
            ============================================================ */}
        <aside className="soc-left-sidebar x-sidebar-layout">
          
          {/* Artisan & Project-Specific Navigation Menu */}
          <nav className="x-nav-menu">
            {/* 1. Community Feed */}
            <button
              className={`x-nav-item ${(activeNav === 'home' || activeNav === 'feed') ? 'active' : ''}`}
              onClick={() => {
                handleTabSelect('feed');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="x-nav-icon-wrap">
                <Home size={22} strokeWidth={(activeNav === 'home' || activeNav === 'feed') ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Community Feed</span>
            </button>

            {/* 2. Explore Makers */}
            <button
              className={`x-nav-item ${activeNav === 'explore' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('explore');
                if (onNavigate) onNavigate('/makers');
              }}
            >
              <div className="x-nav-icon-wrap">
                <Compass size={22} strokeWidth={activeNav === 'explore' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Meet Makers</span>
            </button>

            {/* 3. Shop & Studio Drops */}
            <button
              className={`x-nav-item ${activeNav === 'shop' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('shop');
                if (onNavigate) onNavigate('/shop');
              }}
            >
              <div className="x-nav-icon-wrap">
                <ShoppingBag size={22} strokeWidth={activeNav === 'shop' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Shop Handcrafts</span>
            </button>

            {/* 4. Notifications */}
            <button
              className={`x-nav-item ${activeNav === 'notifications' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('notifications');
                if (showToast) showToast('Notifications: 2 new artisan craft drops & restocks');
              }}
            >
              <div className="x-nav-icon-wrap">
                <Bell size={22} strokeWidth={activeNav === 'notifications' ? 2.5 : 2} />
                <span className="x-nav-badge">2</span>
              </div>
              <span className="x-nav-label">Notifications</span>
            </button>

            {/* 5. Maker Chat / Direct */}
            <button
              className={`x-nav-item ${activeNav === 'chat' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('chat');
                if (showToast) showToast('Maker Direct Messages: Chat directly with master craftspeople');
              }}
            >
              <div className="x-nav-icon-wrap">
                <MessageSquare size={22} strokeWidth={activeNav === 'chat' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Artisan Chat</span>
            </button>

            {/* 6. Saved & Favorites */}
            <button
              className={`x-nav-item ${activeNav === 'favorites' ? 'active' : ''}`}
              onClick={() => {
                handleTabSelect('favorites');
                if (showToast) showToast(`Viewing saved craft stories (${posts.filter(p => p.isSaved).length} saved)`);
              }}
            >
              <div className="x-nav-icon-wrap">
                <Bookmark size={22} strokeWidth={activeNav === 'favorites' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Saved Stories</span>
            </button>

            {/* 7. Liked Stories */}
            <button
              className={`x-nav-item ${activeNav === 'liked' ? 'active' : ''}`}
              onClick={() => {
                handleTabSelect('liked');
                if (showToast) showToast(`Viewing liked craft stories (${posts.filter(p => p.isLiked).length} liked)`);
              }}
            >
              <div className="x-nav-icon-wrap">
                <Heart size={22} strokeWidth={activeNav === 'liked' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Liked Stories</span>
            </button>

            {/* 8. Discussions & Comments */}
            <button
              className={`x-nav-item ${activeNav === 'comments' ? 'active' : ''}`}
              onClick={() => {
                handleTabSelect('comments');
                if (showToast) showToast('Viewing craft stories with community discussions');
              }}
            >
              <div className="x-nav-icon-wrap">
                <MessageCircle size={22} strokeWidth={activeNav === 'comments' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Discussions</span>
            </button>

            {/* 7. Creator / Artisan Studio */}
            <button
              className={`x-nav-item ${activeNav === 'creator-studio' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('creator-studio');
                if (showToast) showToast('Artisan Studio: Manage studio drops, listings & craft storytelling');
              }}
            >
              <div className="x-nav-icon-wrap">
                <Rocket size={22} strokeWidth={activeNav === 'creator-studio' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Artisan Studio</span>
            </button>

            {/* 8. Craft Club & Perks */}
            <button
              className={`x-nav-item ${activeNav === 'premium' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('premium');
                if (showToast) showToast('Craftinator Club: Early access to limited handcrafted batches & workshops');
              }}
            >
              <div className="x-nav-icon-wrap">
                <BadgeCheck size={22} strokeWidth={activeNav === 'premium' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">Craft Club</span>
            </button>

            {/* 9. Profile */}
            <button
              className={`x-nav-item ${activeNav === 'profile' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('profile');
                if (showToast) showToast('Profile: Subham Roy Avi (@Subham_Roy_Avi)');
              }}
            >
              <div className="x-nav-icon-wrap">
                <User size={22} strokeWidth={activeNav === 'profile' ? 2.5 : 2} />
              </div>
              <span className="x-nav-label">My Profile</span>
            </button>

            {/* 10. More Settings */}
            <button
              className={`x-nav-item ${activeNav === 'more' ? 'active' : ''}`}
              onClick={() => {
                if (showToast) showToast('Settings: Artisan guidelines, Language preferences & Help Desk');
              }}
            >
              <div className="x-nav-icon-wrap">
                <MoreHorizontal size={22} />
              </div>
              <span className="x-nav-label">More</span>
            </button>
          </nav>

          {/* Primary Action Button - Share Craft Story */}
          <button
            type="button"
            className="x-post-primary-btn craft-post-btn"
            onClick={() => {
              if (showToast) showToast('Story composer opened! Share your handmade craft journey...');
            }}
          >
            <Sparkles size={16} />
            <span>Share Craft Story</span>
          </button>

          {/* Bottom Artisan Profile Pill */}
          <div
            className="x-user-account-pill craft-user-pill"
            onClick={() => {
              if (showToast) showToast('Active as Subham Roy Avi • Artisan Enthusiast');
            }}
          >
            <div className="x-user-pill-left">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                alt="Subham Roy Avi"
                className="x-user-pill-avatar"
              />
              <div className="x-user-pill-info">
                <strong className="x-user-pill-name">
                  Subham Roy Avi 🇮🇳
                </strong>
                <span className="x-user-pill-handle">Artisan Collector</span>
              </div>
            </div>
            <div className="x-user-pill-dots">
              <MoreHorizontal size={16} />
            </div>
          </div>

        </aside>

        {/* ============================================================
            2. MIDDLE COLUMN (Search & Create, Stories, Feeds, Infinite Scroll)
            ============================================================ */}
        <main className="soc-center-feed">
          
          {/* Top Bar: Search Input + Create New Post Button */}
          <div className="soc-top-bar">
            <div className="soc-search-wrapper">
              <Search size={18} className="soc-search-icon" />
              <input
                type="text"
                placeholder="Search craft stories, artisans, materials, #pottery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="soc-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="soc-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              className="soc-create-post-btn"
              onClick={() => {
                if (showToast) showToast('Story composer opened! Share your handmade craft journey...');
              }}
            >
              <Sparkles size={16} />
              <span>Share Story</span>
            </button>
          </div>

          {/* Mobile Quick Category Navigation Strip (Visible on Mobile/Tablet) */}
          <div className={`soc-mobile-nav-chips ${isNavStripVisible ? 'visible' : ''}`}>
            <button
              type="button"
              className={`soc-mobile-chip ${(activeNav === 'feed' || activeNav === 'home') ? 'active' : ''}`}
              onClick={() => handleTabSelect('feed')}
            >
              <Home size={14} />
              <span>Feed</span>
            </button>
            <button
              type="button"
              className={`soc-mobile-chip ${activeNav === 'favorites' ? 'active' : ''}`}
              onClick={() => handleTabSelect('favorites')}
            >
              <Bookmark size={14} />
              <span>Saved</span>
            </button>
            <button
              type="button"
              className={`soc-mobile-chip ${activeNav === 'liked' ? 'active' : ''}`}
              onClick={() => {
                handleTabSelect('liked');
                if (showToast) showToast(`Viewing liked craft stories (${posts.filter(p => p.isLiked).length} liked)`);
              }}
            >
              <Heart size={14} />
              <span>Liked</span>
            </button>
            <button
              type="button"
              className={`soc-mobile-chip ${activeNav === 'comments' ? 'active' : ''}`}
              onClick={() => {
                handleTabSelect('comments');
                if (showToast) showToast('Viewing craft stories with community discussions');
              }}
            >
              <MessageCircle size={14} />
              <span>Comments</span>
            </button>
          </div>

          

          {/* Feeds Section Header (Popular / Latest Filter + Live Feed Count) */}
          {/* <div className="soc-feeds-header">
            <div className="soc-feeds-heading-wrap">
              <h3 className="soc-section-heading">
                {activeNav === 'favorites' ? 'Saved Stories' : 'Community Feed'}
              </h3>
              <span className="soc-feeds-badge-counter">{filteredPosts.length}</span>
            </div>

            <div className="soc-feed-toggle-group">
              <button
                type="button"
                className={`soc-feed-toggle-btn ${feedFilter === 'popular' ? 'active' : ''}`}
                onClick={() => setFeedFilter('popular')}
              >
                Popular
              </button>
              <button
                type="button"
                className={`soc-feed-toggle-btn ${feedFilter === 'latest' ? 'active' : ''}`}
                onClick={() => setFeedFilter('latest')}
              >
                Latest
              </button>
            </div>
          </div> */}

          {/* Continuous Posts Stream with Smooth Tab Transitions */}
          {isTabLoading ? (
            <div className="soc-posts-container tab-loading animate-fade-in" key="tab-skeleton">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : visiblePosts.length === 0 ? (
            <div className="soc-no-posts-card animate-fade-in" key={`tab-empty-${activeNav}`}>
              <div className="soc-no-posts-icon">🏺</div>
              <h4>No posts found</h4>
              <p>
                {searchQuery
                  ? `No matching craft stories found for "${searchQuery}". Try a different keyword.`
                  : activeNav === 'favorites'
                  ? 'You haven’t saved any posts yet. Click the bookmark icon on any post to add it here!'
                  : activeNav === 'liked'
                  ? 'You haven’t liked any craft stories yet. Click the heart icon on any post to see it here!'
                  : activeNav === 'comments'
                  ? 'No posts with community discussions found yet. Be the first to start a conversation!'
                  : 'Check back soon for new artisan updates.'}
              </p>
              {searchQuery && (
                <button
                  className="soc-view-product-btn"
                  style={{ alignSelf: 'center', marginTop: '0.75rem' }}
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="soc-posts-container tab-ready animate-fade-in" key={`tab-posts-${activeNav}`}>
              {visiblePosts.map((post, idx) => (
                <React.Fragment key={post.id}>
                  <PostCard
                    post={post}
                    onToggleLike={handleToggleLike}
                    onToggleSave={handleToggleSave}
                    onOpenArtisanModal={onOpenArtisanModal}
                    onOpenProductModal={onOpenProductModal}
                    onNavigate={onNavigate}
                    showToast={showToast}
                    onFilterTag={(ht) => {
                      setSearchQuery(ht.replace('#', ''));
                      if (showToast) showToast(`Filtering by tag ${ht}`);
                    }}
                  />

                  {/* Responsive In-Feed Suggested Creators Strip (Rendered after 2nd post) */}
                  {idx === 1 && suggestions.length > 0 && (
                    <div className="soc-infeed-discovery-card">
                      <div className="soc-infeed-discovery-header">
                        <div className="soc-infeed-title-wrap">
                          <Sparkles size={16} className="soc-infeed-icon" />
                          <h4 className="soc-infeed-title">Featured Master Artisans</h4>
                        </div>
                        <span
                          className="soc-view-all-link"
                          onClick={() => onNavigate && onNavigate('/makers')}
                        >
                          Explore All Makers →
                        </span>
                      </div>

                      {/* Slider Wrapper with Desktop & Tablet Left/Right Controls */}
                      <div className="soc-infeed-slider-wrapper">
                        <button
                          type="button"
                          className="soc-infeed-slider-arrow soc-infeed-slider-arrow-prev"
                          onClick={handleInfeedScrollPrev}
                          aria-label="Previous artisans"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <div className="soc-infeed-creators-strip" ref={infeedSliderRef}>
                          {suggestions.map(artisan => (
                            <div
                              key={`infeed-${artisan.id}`}
                              className="soc-infeed-creator-card"
                              onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisan)}
                              title={`View ${artisan.name}'s craft profile`}
                            >
                              <div className="soc-infeed-avatar-box">
                                <img src={artisan.avatar} alt={artisan.name} className="soc-infeed-avatar" />
                              </div>
                              <h5 className="soc-infeed-name" title={artisan.name}>{artisan.name}</h5>
                              <span className="soc-infeed-craft" title={artisan.craft}>{artisan.craft}</span>
                              <span className="soc-infeed-loc" title={`${artisan.city}, ${artisan.state}`}>
                                <MapPin size={11} className="soc-infeed-pin-icon" />
                                <span className="soc-infeed-loc-text">{artisan.city}, {artisan.state}</span>
                              </span>
                              <button
                                type="button"
                                className={`soc-infeed-follow-btn ${artisan.followed ? 'followed' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSuggestion(artisan.id);
                                }}
                              >
                                {artisan.followed ? 'Following' : '+ Follow'}
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="soc-infeed-slider-arrow soc-infeed-slider-arrow-next"
                          onClick={handleInfeedScrollNext}
                          aria-label="Next artisans"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* ============================================================
                  SKELETON PLACEHOLDERS DURING INFINITE SCROLL BATCH LOADING
                  ============================================================ */}
              {isLoadingMore && (
                <div className="soc-skeleton-stream">
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              )}
            </div>
          )}

          {/* End of Feed Celebration Banner */}
          {!isLoadingMore && visibleCount >= filteredPosts.length && filteredPosts.length > 0 && (
            <div className="soc-feed-end-banner animate-fade-in">
              <div className="soc-feed-end-icon-ring">
                <Sparkles size={20} />
              </div>
              <h5 className="soc-feed-end-title">You're All Caught Up! ✨</h5>
              <p className="soc-feed-end-text">
                You’ve explored all {filteredPosts.length} curated artisan stories from the Craftinator community.
              </p>
              <button
                type="button"
                className="soc-scroll-top-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top ↑
              </button>
            </div>
          )}

          {/* Invisible Observer Sentinel Element */}
          <div ref={sentinelRef} className="soc-feed-sentinel" aria-hidden="true" />

        </main>

        {/* ============================================================
            3. RIGHT SIDEBAR (Requests, Suggestions, Activity, Links)
            ============================================================ */}
        <aside ref={rightSidebarRef} className="soc-right-sidebar">
          
          {/* Requests Section */}
          <div className="soc-widget-box">
            <div className="soc-widget-title-row">
              <h4 className="soc-contacts-header" style={{ marginBottom: 0 }}>Requests</h4>
              <span className="soc-badge-counter">{requests.length}</span>
            </div>

            {requests.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No pending requests</p>
            ) : (
              <div className="soc-request-list">
                {requests.map(req => (
                  <div key={req.id} className="soc-request-item">
                    <img src={req.avatar} alt={req.name} className="soc-request-avatar" />
                    <div className="soc-request-body">
                      <p className="soc-request-text">
                        <strong>{req.name}</strong> wants to add you to friends
                      </p>
                      <div className="soc-request-actions">
                        <button
                          className="soc-accept-btn"
                          onClick={() => handleRequestAction(req.id, 'accept')}
                        >
                          Accept
                        </button>
                        <button
                          className="soc-decline-btn"
                          onClick={() => handleRequestAction(req.id, 'decline')}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions for you */}
          <div className="soc-widget-box">
            <h4 className="soc-contacts-header">Suggestions for you</h4>
            <div className="soc-suggestion-list">
              {suggestions.slice(0, 5).map(s => (
                <div key={s.id} className="soc-suggestion-item">
                  <div
                    className="soc-suggest-info"
                    onClick={() => onOpenArtisanModal && onOpenArtisanModal(s)}
                    style={{ cursor: 'pointer' }}
                    title={`View ${s.name}'s profile`}
                  >
                    <div className="soc-suggest-avatar-box">
                      <img src={s.avatar} alt={s.name} className="soc-suggest-avatar" />
                    </div>
                    <div>
                      <h5 className="soc-suggest-name">{s.name}</h5>
                      <span className="soc-suggest-loc">{s.craft || s.loc}</span>
                    </div>
                  </div>

                  <button
                    className="soc-add-user-btn"
                    onClick={() => handleToggleSuggestion(s.id)}
                    aria-label={`Add ${s.name}`}
                  >
                    {s.followed ? (
                      <Check size={18} style={{ color: '#27AE60' }} />
                    ) : (
                      <UserPlus size={18} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <span
              className="soc-view-all-link"
              onClick={() => {
                if (showToast) showToast('Showing all suggested creators');
              }}
            >
              View All
            </span>
          </div>

          {/* Followers Profile Activity Card */}
          <div className="soc-activity-card">
            <div className="soc-avatar-cluster">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" alt="u1" className="soc-cluster-avatar" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="u2" className="soc-cluster-avatar" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="u3" className="soc-cluster-avatar" />
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop" alt="u4" className="soc-cluster-avatar" />
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="u5" className="soc-cluster-avatar" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" alt="u6" className="soc-cluster-avatar" />
            </div>

            <h4 className="soc-activity-title">184.3K <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Followers</span></h4>
            <p className="soc-activity-sub">Active now on your profile</p>
          </div>

          {/* Micro Footer Links */}
          <div className="soc-micro-links">
            <span className="soc-micro-link" onClick={() => onNavigate && onNavigate('/')}>About</span>
            <span className="soc-micro-link">Accessibility</span>
            <span className="soc-micro-link">Help Center</span>
            <span className="soc-micro-link">Privacy and Terms</span>
            <span className="soc-micro-link">Advertising</span>
            <span className="soc-micro-link">Business Services</span>
          </div>

        </aside>

      </div>

      {/* 5. MOBILE FLOATING ACTION BUTTON (Post / Share Craft Story) */}
      <button
        type="button"
        className="soc-mobile-fab-btn"
        onClick={() => {
          if (showToast) showToast('Story composer opened! Share your handmade craft journey...');
        }}
        aria-label="Share craft story"
      >
        <Sparkles size={18} />
        <span>Post Story</span>
      </button>

    </div>
  );
}
