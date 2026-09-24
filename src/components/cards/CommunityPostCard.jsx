import React, { useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Share2,
  Tag,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

/**
 * CommunityPostCard Component
 * Shared social feed card used across CommunityPage and ArtisanDetailsPage Studio Feed.
 */
export default function CommunityPostCard({
  post,
  onToggleLike,
  onToggleSave,
  onOpenArtisanModal,
  onOpenProductModal,
  onNavigate,
  showToast,
  onFilterTag,
}) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localLiked, setLocalLiked] = useState(Boolean(post.isLiked));
  const [localLikesCount, setLocalLikesCount] = useState(
    typeof post.likes === "number"
      ? post.likes
      : parseInt(String(post.likes).replace(/[^0-9]/g, ""), 10) || 0
  );
  const [localSaved, setLocalSaved] = useState(Boolean(post.isSaved));

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const images =
    post.images && post.images.length > 0
      ? post.images
      : [post.mainImg || post.mediaImg || post.image].filter(Boolean);
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
      setCurrentImgIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    } else if (diff < -40 && hasMultiple) {
      setCurrentImgIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onToggleLike) {
      onToggleLike(post.id);
    } else {
      setLocalLiked((prev) => {
        const next = !prev;
        setLocalLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
        if (showToast) {
          showToast(next ? "Post liked" : "Post unliked");
        }
        return next;
      });
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(post.id);
    } else {
      setLocalSaved((prev) => {
        const next = !prev;
        if (showToast) {
          showToast(next ? "Saved to collection" : "Removed from collection");
        }
        return next;
      });
    }
  };

  const isLiked = onToggleLike ? Boolean(post.isLiked) : localLiked;
  const likesCount = onToggleLike ? post.likes : localLikesCount;
  const isSaved = onToggleSave ? Boolean(post.isSaved) : localSaved;

  // Caption truncation logic (120 characters threshold)
  const captionText = post.caption || post.text || "";
  const isLongCaption = captionText && captionText.length > 120;
  const displayedCaption =
    isLongCaption && !isExpanded
      ? `${captionText.slice(0, 120)}...`
      : captionText;

  const authorName = post.author || post.authorName || "Master Artisan";
  const authorAvatar =
    post.avatar || post.authorAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop";
  const authorRole = post.authorRole || post.craft || "Artisan Maker";
  const handle =
    post.handle || `@${authorName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const timeDisplay = post.timeAgo || post.date || "Recently";

  return (
    <article className="soc-post-card">
      {/* Top Shop / Craft Specialty Banner (Mobile Mode - Full Width) */}
      {authorRole && (
        <div
          className="soc-post-seller-strip"
          onClick={() => {
            if (onOpenArtisanModal) {
              onOpenArtisanModal({
                name: authorName,
                specialty: authorRole,
                image: authorAvatar,
                location: "India",
              });
            } else if (showToast) {
              showToast(`Viewing ${authorName}'s artisan shop`);
            }
          }}
          title={`View ${authorName}'s artisan shop`}
        >
          <span className="soc-post-author-badge" title={authorRole}>
            {authorRole}
          </span>
        </div>
      )}

      {/* 1. Post Author Header */}
      <div className="soc-post-author-row">
        <div
          className="soc-post-author-info"
          onClick={() => {
            if (onOpenArtisanModal) {
              onOpenArtisanModal({
                name: authorName,
                specialty: authorRole,
                image: authorAvatar,
                location: "India",
              });
            } else if (showToast) {
              showToast(`Viewing ${authorName}'s profile`);
            }
          }}
        >
          <img
            src={authorAvatar}
            alt={authorName}
            className="soc-post-avatar"
            loading="lazy"
          />
          <div>
            <div className="soc-post-author-name-wrap">
              <h4 className="soc-post-name">{authorName}</h4>
              {authorRole && (
                <span className="soc-post-author-badge soc-post-author-badge-desktop">
                  {authorRole}
                </span>
              )}
            </div>
            <div className="soc-post-meta-sub">
              <span className="soc-post-handle">{handle}</span>
              {timeDisplay && (
                <>
                  <span className="soc-post-dot">•</span>
                  <span className="soc-post-time">{timeDisplay}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="soc-post-more-btn"
          onClick={() => {
            if (showToast)
              showToast("Post options: Share, Copy link, Bookmark");
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
            <div key={idx} className="soc-media-slider-slide">
              <img
                src={imgUrl}
                alt={`${authorName} craft presentation ${idx + 1}`}
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
                  className={`soc-slider-dot ${idx === currentImgIndex ? "active" : ""}`}
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
              src={post.product.image || post.product.images?.[0]}
              alt={post.product.name}
              className="soc-product-card-thumb"
              loading="lazy"
            />
            <div className="soc-product-card-meta">
              <div className="soc-product-card-tag-row">
                <span className="soc-product-card-cat">
                  <Tag size={11} style={{ marginRight: "3px" }} />
                  {post.product.category || "Handcrafted"}
                </span>
                {post.product.badge && (
                  <span className="soc-product-card-badge">
                    {post.product.badge}
                  </span>
                )}
              </div>
              <h5 className="soc-product-card-title">{post.product.name}</h5>
              <div className="soc-product-card-price-row">
                <span className="soc-product-card-price">
                  ₹
                  {typeof post.product.price === "number"
                    ? post.product.price.toLocaleString("en-IN")
                    : post.product.price}
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
              {isExpanded ? " less" : " more"}
            </button>
          )}
        </p>

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="soc-hashtags-row">
            {post.hashtags.map((ht, idx) => (
              <span
                key={idx}
                className="soc-hashtag-item"
                onClick={() => onFilterTag && onFilterTag(ht)}
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
            className={`soc-action-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLikeClick}
            aria-label="Like post"
          >
            <Heart size={20} />
            <span>{likesCount}</span>
          </button>

          <button
            type="button"
            className="soc-action-btn"
            onClick={() => {
              if (showToast) showToast("Comment thread opened");
            }}
            aria-label="Comment on post"
          >
            <MessageCircle size={20} />
            <span>{post.comments || 0}</span>
          </button>

          <button
            type="button"
            className="soc-action-btn"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              if (showToast) showToast("Post link copied to clipboard!");
            }}
            aria-label="Share post"
          >
            <Share2 size={18} />
          </button>
        </div>

        <button
          type="button"
          className={`soc-bookmark-btn ${isSaved ? "saved" : ""}`}
          onClick={handleSaveClick}
          aria-label="Bookmark post"
          title={isSaved ? "Remove from favorites" : "Save to favorites"}
        >
          <Bookmark size={20} />
        </button>
      </div>
    </article>
  );
}
