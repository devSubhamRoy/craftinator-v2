import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, ArrowRight, UserPlus, Check, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { communityPosts } from '../data/communityPosts';

export default function CommunitySection({ onExploreClick }) {
  const { t } = useLanguage();
  const [posts, setPosts] = useState(communityPosts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserAutoPlay, setIsUserAutoPlay] = useState(true);

  /* Screen width helper for dynamic offset sizing */
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Touch / Mouse Drag States */
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);

  /* Slide controls */
  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : posts.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < posts.length - 1 ? prev + 1 : 0));
  };

  /* Auto-Swipe Timer (Every 4 Seconds) */
  useEffect(() => {
    if (isPaused || !isUserAutoPlay || isDragging) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, isUserAutoPlay, isDragging]);

  /* Touch / Mouse Drag Handlers */
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setDragStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (dragStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragOffset < -40) {
      handleNext();
    } else if (dragOffset > 40) {
      handlePrev();
    }
    setDragStartX(null);
    setDragOffset(0);
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleMouseDown = (e) => {
    setIsPaused(true);
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (dragStartX === null || !isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - dragStartX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -40) {
      handleNext();
    } else if (dragOffset > 40) {
      handlePrev();
    }
    setDragStartX(null);
    setDragOffset(0);
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 2000);
  };

  /* Post Actions (Like, Save, Follow) */
  const handleLikePost = (id) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleSavePost = (id) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleFollowAuthor = (id) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, isFollowing: !p.isFollowing } : p))
    );
  };

  /* Card Stacking Style Calculation (Responsive Compact Offsets) */
  const getCardStyle = (index) => {
    const total = posts.length;
    const offset = (index - currentIndex + total) % total;

    const step1X = isMobileScreen ? 14 : 20;
    const step2X = isMobileScreen ? 28 : 38;

    // Active Front Card
    if (offset === 0) {
      return {
        transform: `translateX(${dragOffset}px) scale(1) rotate(${dragOffset * 0.03}deg)`,
        zIndex: 10,
        opacity: 1,
        pointerEvents: 'auto',
        transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease',
      };
    }

    // 1st Card Stacked Behind Right
    if (offset === 1) {
      return {
        transform: `translateX(${step1X + dragOffset * 0.15}px) translateY(-6px) scale(0.95) rotate(2.5deg)`,
        zIndex: 8,
        opacity: 0.9,
        pointerEvents: 'auto',
        transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease',
      };
    }

    // 2nd Card Stacked Behind Right
    if (offset === 2) {
      return {
        transform: `translateX(${step2X + dragOffset * 0.08}px) translateY(-12px) scale(0.90) rotate(5deg)`,
        zIndex: 6,
        opacity: 0.75,
        pointerEvents: 'none',
        transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease',
      };
    }

    // Hidden / Stacked Behind Left
    return {
      transform: `translateX(-24px) translateY(-10px) scale(0.85) rotate(-4deg)`,
      zIndex: 2,
      opacity: 0,
      pointerEvents: 'none',
      transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease',
    };
  };

  return (
    <section className="community-section" id="community-section">
      <div className="container community-container">
        
        {/* Left Column: Headline & CTA */}
        <div className="community-left">
          <span className="eyebrow">{t('nav_community')}</span>
          <h2 className="heading-lg community-title">
            {t('community_title')}
          </h2>
          <p className="paragraph-lg community-subtitle">
            {t('community_subtitle')}
          </p>

          <div className="community-cta-row">
            <a href="#trending-products" className="btn btn-primary community-cta-btn" onClick={onExploreClick}>
              {t('community_cta')} <ArrowRight size={18} />
            </a>

            {/* Auto-play Status Toggle */}
            <button
              className={`community-autoplay-toggle ${isUserAutoPlay && !isPaused ? 'active' : ''}`}
              onClick={() => setIsUserAutoPlay(!isUserAutoPlay)}
              title={isUserAutoPlay ? "Pause Auto Swiping" : "Resume Auto Swiping"}
            >
              {isUserAutoPlay && !isPaused ? (
                <>
                  <span className="pulse-dot" />
                  <Pause size={14} />
                  <span>Auto Swipe</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>Auto Swiping Paused</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Compact 3D Stacked Card Deck */}
        <div className="community-right">
          <div
            className="community-deck-wrapper"
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              if (!isDragging) setIsPaused(false);
            }}
          >
            {/* Left & Right Arrow Buttons */}
            <button
              className="community-deck-arrow community-deck-prev"
              onClick={handlePrev}
              aria-label="Previous card"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              className="community-deck-arrow community-deck-next"
              onClick={handleNext}
              aria-label="Next card"
            >
              <ChevronRight size={18} />
            </button>

            {/* Stacked Deck View */}
            <div
              className="community-deck-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {posts.map((post, idx) => {
                const style = getCardStyle(idx);
                const isFront = (idx - currentIndex + posts.length) % posts.length === 0;

                return (
                  <div
                    key={post.id}
                    className={`community-stacked-card ${isFront ? 'is-front' : ''}`}
                    style={style}
                    onClick={() => {
                      if (!isFront) {
                        setCurrentIndex(idx);
                      }
                    }}
                  >
                    {/* Post Header */}
                    <div className="post-header">
                      <div className="post-author">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="post-avatar"
                        />
                        <div className="post-author-info">
                          <strong>{post.authorRole} • {post.authorName}</strong>
                          <span className="post-handle">{post.handle}</span>
                        </div>
                      </div>
                      <button
                        className={`post-follow-btn ${post.isFollowing ? 'following' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowAuthor(post.id);
                        }}
                      >
                        {post.isFollowing ? (
                          <>
                            <Check size={13} /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={13} /> Follow
                          </>
                        )}
                      </button>
                    </div>

                    {/* Post Content & Media */}
                    <div className="post-body">
                      <p className="post-text">{post.text}</p>
                      
                      <div className="post-media">
                        <img
                          src={post.mediaImg}
                          alt={post.mediaAlt}
                          className="post-img img-cover"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="post-tags-overlay">
                          {post.tags.map((tag, tIdx) => (
                            <span className="post-tag-pill" key={tIdx}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Post Action Bar */}
                    <div className="post-actions-bar">
                      <button
                        className={`post-action-btn ${post.isLiked ? 'active-like' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikePost(post.id);
                        }}
                      >
                        <Heart size={16} fill={post.isLiked ? '#A85838' : 'none'} color={post.isLiked ? '#A85838' : 'currentColor'} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        className="post-action-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle size={16} />
                        <span>{post.comments}</span>
                      </button>

                      <button
                        className={`post-action-btn ${post.isSaved ? 'active-save' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSavePost(post.id);
                        }}
                      >
                        <Bookmark size={16} fill={post.isSaved ? '#231815' : 'none'} />
                        <span>{post.isSaved ? post.savedCount + 1 : post.savedCount}</span>
                      </button>

                      <button
                        className="post-action-btn post-share-btn"
                        aria-label="Share post"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 size={16} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
