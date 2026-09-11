import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Heart,
  MessageCircle,
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
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { communityPosts } from '../data/communityPosts';

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
  onOpenStory,
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
                <span className="soc-post-author-badge">{post.authorRole}</span>
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
              onClick={() => onOpenStory({
                author: post.author,
                storyImg: imgUrl,
                caption: post.caption,
                avatar: post.avatar
              })}
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
          <div
            className="soc-product-card-left"
            onClick={() => {
              if (onOpenProductModal) {
                onOpenProductModal(post.product);
              } else if (onNavigate) {
                onNavigate(`/product?id=${post.product.id}`);
              }
            }}
          >
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
export default function CommunityPage({
  onOpenArtisanModal,
  onOpenProductModal,
  onNavigate,
  showToast
}) {
  const { t } = useLanguage();

  // Active Navigation Tab (Left Sidebar)
  const [activeNav, setActiveNav] = useState('feed');

  // Feeds Filter Toggle (Middle Column: 'popular' | 'latest')
  const [feedFilter, setFeedFilter] = useState('popular');

  // Search Input State
  const [searchQuery, setSearchQuery] = useState('');

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  // Posts Stream Data (Initialized with 104+ posts from data module)
  const [posts, setPosts] = useState(communityPosts);

  // Stories Data (Middle Column)
  const stories = [
    {
      id: 1,
      name: 'Gladys',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      storyImg: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Kristin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      storyImg: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Priscilla',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      storyImg: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'Connie',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      storyImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 5,
      name: 'Brandie',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      storyImg: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 6,
      name: 'Lily',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
      storyImg: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop'
    }
  ];

  // Story Viewer Overlay State
  const [activeStoryModal, setActiveStoryModal] = useState(null);

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

  // Right Sidebar Suggestions for You Data
  const [suggestions, setSuggestions] = useState([
    { id: 1, name: 'Chantal Shelburne', loc: 'Memphis, TN, US', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop', followed: false },
    { id: 2, name: 'Marci Senter', loc: 'Newark, NJ, US', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', followed: false },
    { id: 3, name: 'Janetta Rotolo', loc: 'Fort Worth, TX, US', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop', followed: false },
    { id: 4, name: 'Tyra Dhillon', loc: 'Springfield, MA, US', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop', followed: false },
    { id: 5, name: 'Marielle Wigington', loc: 'Honolulu, HI, US', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop', followed: false }
  ]);

  // Reset infinite scroll count when filtering or searching
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeNav, feedFilter, searchQuery]);

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

    // Left navigation tab filters
    if (activeNav === 'favorites') {
      result = result.filter(p => p.isSaved);
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

  return (
    <div className="community-app-root animate-fade-in">
      
      {/* 3-COLUMN SOCIAL APP CONTAINER */}
      <div className="soc-app-grid">
        
        {/* ============================================================
            1. LEFT SIDEBAR (Profile Card + Nav Menu + Contacts)
            ============================================================ */}
        <aside className="soc-left-sidebar">
          
          {/* User Profile Card */}
          <div className="soc-profile-card">
            <div className="soc-avatar-wrapper">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                alt="Cyndy Lillibridge"
                className="soc-avatar-img"
              />
              <span className="soc-verified-badge" title="Verified Artisan Community Member">
                <Check size={12} strokeWidth={3} />
              </span>
            </div>

            <h3 className="soc-profile-name">Cyndy Lillibridge</h3>
            <p className="soc-profile-location">Torrance, CA, United States</p>

            <div className="soc-stats-row">
              <div className="soc-stat-item">
                <span className="soc-stat-num">368</span>
                <span className="soc-stat-lbl">Posts</span>
              </div>
              <div className="soc-stat-item">
                <span className="soc-stat-num">184.3K</span>
                <span className="soc-stat-lbl">Followers</span>
              </div>
              <div className="soc-stat-item">
                <span className="soc-stat-num">1.04M</span>
                <span className="soc-stat-lbl">Following</span>
              </div>
            </div>
          </div>

          {/* Social Navigation Menu */}
          <nav className="soc-nav-menu">
            <button
              className={`soc-nav-btn ${activeNav === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveNav('feed')}
            >
              <Home size={18} />
              <span>Feed</span>
            </button>

            <button
              className={`soc-nav-btn ${activeNav === 'explore' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('explore');
                if (onNavigate) onNavigate('/makers');
              }}
            >
              <Compass size={18} />
              <span>Explore Makers</span>
            </button>

            <button
              className={`soc-nav-btn ${activeNav === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveNav('favorites')}
            >
              <Bookmark size={18} />
              <span>My Favorites ({posts.filter(p => p.isSaved).length})</span>
            </button>

            <button
              className={`soc-nav-btn ${activeNav === 'direct' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('direct');
                if (showToast) showToast('Direct Messages inbox opened');
              }}
            >
              <Send size={18} />
              <span>Direct</span>
            </button>

            <button
              className={`soc-nav-btn ${activeNav === 'stats' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('stats');
                if (showToast) showToast('Profile Analytics: +14.2% engagement this week');
              }}
            >
              <BarChart2 size={18} />
              <span>Stats</span>
            </button>

            <button
              className={`soc-nav-btn ${activeNav === 'settings' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('settings');
                if (showToast) showToast('Settings modal ready');
              }}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Contacts List Card */}
          <div className="soc-contacts-card">
            <h4 className="soc-contacts-header">Contacts</h4>
            <div className="soc-contact-list">
              {contacts.map(c => (
                <div key={c.id} className="soc-contact-item">
                  <div className="soc-contact-info">
                    <div className="soc-contact-avatar-box">
                      <img src={c.avatar} alt={c.name} className="soc-contact-avatar" />
                      {c.online && <span className="soc-online-dot" />}
                    </div>
                    <div>
                      <h5 className="soc-contact-name">{c.name}</h5>
                      <span className="soc-contact-loc">{c.loc}</span>
                    </div>
                  </div>

                  <button
                    className="soc-chat-icon-btn"
                    onClick={() => {
                      if (showToast) showToast(`Chat opened with ${c.name}`);
                    }}
                    aria-label={`Chat with ${c.name}`}
                  >
                    <MessageCircle size={17} />
                  </button>
                </div>
              ))}
            </div>

            <span
              className="soc-view-all-link"
              onClick={() => {
                if (showToast) showToast('Showing all 42 contacts');
              }}
            >
              View All
            </span>
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
                className="soc-search-input"
                placeholder="Search posts, artisans, tags or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="soc-search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              className="soc-create-post-btn"
              onClick={() => {
                if (showToast) showToast('Story & Post composer opened!');
              }}
            >
              <Plus size={18} />
              <span>Create new post</span>
            </button>
          </div>

          {/* Stories Section */}
          <div className="soc-stories-section">
            <div className="soc-stories-header">
              <h3 className="soc-section-heading">Stories</h3>
              <span
                className="soc-watch-all-link"
                onClick={() => setActiveStoryModal(stories[0])}
              >
                Watch all
              </span>
            </div>

            <div className="soc-stories-strip">
              {/* Add Story Item */}
              <div
                className="soc-story-item"
                onClick={() => {
                  if (showToast) showToast('Camera / Story uploader ready');
                }}
              >
                <div className="soc-add-story-ring">
                  <Plus size={22} />
                </div>
                <span className="soc-story-author">Add story</span>
              </div>

              {/* Story Avatars */}
              {stories.map(s => (
                <div
                  key={s.id}
                  className="soc-story-item"
                  onClick={() => setActiveStoryModal(s)}
                >
                  <div className="soc-story-ring">
                    <img src={s.avatar} alt={s.name} className="soc-story-img" />
                  </div>
                  <span className="soc-story-author">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feeds Section Header (Popular / Latest Filter + Live Feed Count) */}
          <div className="soc-feeds-header">
            <div className="soc-feeds-heading-wrap">
              <h3 className="soc-section-heading">Feeds</h3>
              <span className="soc-feeds-badge-counter">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            <div className="soc-feed-toggle-group">
              <button
                className={`soc-feed-toggle-btn ${feedFilter === 'popular' ? 'active' : ''}`}
                onClick={() => setFeedFilter('popular')}
              >
                Popular
              </button>
              <button
                className={`soc-feed-toggle-btn ${feedFilter === 'latest' ? 'active' : ''}`}
                onClick={() => setFeedFilter('latest')}
              >
                Latest
              </button>
            </div>
          </div>

          {/* Continuous Posts Stream with Strong Horizontal Line Separator */}
          {visiblePosts.length === 0 ? (
            <div className="soc-no-posts-card">
              <div className="soc-no-posts-icon">🏺</div>
              <h4>No posts found</h4>
              <p>
                {searchQuery
                  ? `No matching craft stories found for "${searchQuery}". Try a different keyword.`
                  : activeNav === 'favorites'
                  ? 'You haven’t saved any posts yet. Click the bookmark icon on any post to add it here!'
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
            <div className="soc-posts-container">
              {visiblePosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleLike={handleToggleLike}
                  onToggleSave={handleToggleSave}
                  onOpenArtisanModal={onOpenArtisanModal}
                  onOpenProductModal={onOpenProductModal}
                  onNavigate={onNavigate}
                  showToast={showToast}
                  onOpenStory={setActiveStoryModal}
                  onFilterTag={(ht) => {
                    setSearchQuery(ht.replace('#', ''));
                    if (showToast) showToast(`Filtering by tag ${ht}`);
                  }}
                />
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
        <aside className="soc-right-sidebar">
          
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
              {suggestions.map(s => (
                <div key={s.id} className="soc-suggestion-item">
                  <div className="soc-suggest-info">
                    <div className="soc-suggest-avatar-box">
                      <img src={s.avatar} alt={s.name} className="soc-suggest-avatar" />
                    </div>
                    <div>
                      <h5 className="soc-suggest-name">{s.name}</h5>
                      <span className="soc-suggest-loc">{s.loc}</span>
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

      {/* ============================================================
          4. FULL-SCREEN STORY VIEWER MODAL
          ============================================================ */}
      {activeStoryModal && (
        <div className="cap-story-modal-overlay animate-fade-in" onClick={() => setActiveStoryModal(null)}>
          <div className="cap-story-modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="cap-story-progress-bar">
              <div className="cap-story-progress-fill" />
            </div>

            <div className="cap-story-modal-header">
              <div className="cap-story-modal-author">
                <img src={activeStoryModal.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'} alt={activeStoryModal.name || activeStoryModal.author} className="cap-story-modal-avatar" />
                <span>{activeStoryModal.name || activeStoryModal.author}</span>
              </div>
              <button className="cap-story-modal-close" onClick={() => setActiveStoryModal(null)}>
                <X size={16} />
              </button>
            </div>

            <img src={activeStoryModal.storyImg} alt="Story" className="cap-story-modal-media" />

            {activeStoryModal.caption && (
              <div className="cap-story-modal-footer">
                <p className="cap-story-modal-caption">{activeStoryModal.caption}</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
