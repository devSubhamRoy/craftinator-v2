import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, ArrowRight, UserPlus, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function CommunitySection({ onExploreClick }) {
  const { t } = useLanguage();
  const [likes, setLikes] = useState(228);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
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
          <a href="#trending-products" className="btn btn-primary community-cta-btn" onClick={onExploreClick}>
            {t('community_cta')} <ArrowRight size={18} />
          </a>
        </div>

        {/* Right Column: Craftinator Social Post Card */}
        <div className="community-right">
          <div className="community-post-card">
            
            {/* Post Header */}
            <div className="post-header">
              <div className="post-author">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                  alt="Maya Sharma"
                  className="post-avatar"
                />
                <div className="post-author-info">
                  <strong>Studio Drop • Maya Sharma</strong>
                  <span className="post-handle">@craftinator</span>
                </div>
              </div>
              <button
                className={`post-follow-btn ${following ? 'following' : ''}`}
                onClick={() => setFollowing(!following)}
              >
                {following ? (
                  <>
                    <Check size={14} /> Following
                  </>
                ) : (
                  <>
                    <UserPlus size={14} /> Follow
                  </>
                )}
              </button>
            </div>

            {/* Post Content & Media */}
            <div className="post-body">
              <p className="post-text">
                Maya's latest raw stoneware ceramic collection has everyone talking. Hand-turned from natural clay and finished with matte mineral ash. ✨
              </p>
              
              <div className="post-media">
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop"
                  alt="Ceramic collection by Maya Sharma"
                  className="post-img img-cover"
                  loading="lazy"
                />
                <div className="post-tags-overlay">
                  <span className="post-tag-pill">🏺 Pottery & Stoneware</span>
                  <span className="post-tag-pill">✨ Artisan Studio</span>
                </div>
              </div>
            </div>

            {/* Post Bar Actions */}
            <div className="post-actions-bar">
              <button
                className={`post-action-btn ${liked ? 'active-like' : ''}`}
                onClick={handleLike}
              >
                <Heart size={18} fill={liked ? '#A85838' : 'none'} color={liked ? '#A85838' : 'currentColor'} />
                <span>{likes}</span>
              </button>

              <button className="post-action-btn">
                <MessageCircle size={18} />
                <span>28</span>
              </button>

              <button
                className={`post-action-btn ${saved ? 'active-save' : ''}`}
                onClick={() => setSaved(!saved)}
              >
                <Bookmark size={18} fill={saved ? '#231815' : 'none'} />
                <span>{saved ? '82' : '81'}</span>
              </button>

              <button className="post-action-btn post-share-btn">
                <Share2 size={18} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
