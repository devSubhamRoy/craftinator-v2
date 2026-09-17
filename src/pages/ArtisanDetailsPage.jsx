import React, { useState, useMemo, useEffect } from 'react';
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
  MoreHorizontal
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { artisans } from '../data/artisans';
import { products as allCatalogProducts } from '../data/products';

// Dynamic formatter turning any artisan into the harmonized profile format
function formatArtisanProfile(artisanData) {
  if (!artisanData) return null;

  const artId = artisanData.id || artisanData.name.toLowerCase().replace(/\s+/g, '-');

  // Studio / Brand Name
  const studioAddress = artisanData.studioDetails?.address || '';
  const firstStudioWord = studioAddress.split(',')[0].trim();
  const brandPill =
    artisanData.brandName ||
    (firstStudioWord && !firstStudioWord.includes('Studio') ? firstStudioWord : '') ||
    `${artisanData.name.split(' ')[0]} Studio`;

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

  // Map to card format
  let productsList = catalogProductsForArtisan.map((p) => ({
    id: p.id,
    name: p.name,
    brand: brandPill,
    price: p.price,
    originalPrice: p.originalPrice || (p.price > 1800 ? Math.round(p.price * 1.25) : null),
    rating: p.rating || artisanData.rating || 4.8,
    location: `${artisanData.city}, ${artisanData.state ? artisanData.state.slice(0, 2) : 'IN'}...`,
    fullLocation: `${artisanData.city}, ${artisanData.state || 'India'}`,
    badge: p.badge || 'HANDMADE',
    image: p.image,
    category: p.category
  }));

  // If catalog has no products for this artisan, synthesize based on work images
  if (productsList.length === 0) {
    productsList = [
      {
        id: `${artId}-prod-1`,
        name: `${artisanData.name.split(' ')[0]} Signature ${artisanData.craft.split(' ')[0]}`,
        brand: brandPill,
        price: 1450,
        originalPrice: null,
        rating: artisanData.rating || 4.8,
        location: `${artisanData.city}, ${artisanData.state ? artisanData.state.slice(0, 2) : 'IN'}...`,
        fullLocation: `${artisanData.city}, ${artisanData.state || 'India'}`,
        badge: 'HANDMADE',
        image: artisanData.workImage1 || artisanData.studioImage,
        category: artisanData.craft
      },
      {
        id: `${artId}-prod-2`,
        name: `Handcrafted ${artisanData.specialties ? artisanData.specialties[0] : 'Artisan Creation'}`,
        brand: brandPill,
        price: 1290,
        originalPrice: 1600,
        rating: 4.75,
        location: `${artisanData.city}, ${artisanData.state ? artisanData.state.slice(0, 2) : 'IN'}...`,
        fullLocation: `${artisanData.city}, ${artisanData.state || 'India'}`,
        badge: 'HANDMADE',
        image: artisanData.workImage2 || artisanData.studioImage,
        category: artisanData.craft
      },
      {
        id: `${artId}-prod-3`,
        name: `Heritage Studio Original`,
        brand: brandPill,
        price: 1150,
        originalPrice: null,
        rating: 4.8,
        location: `${artisanData.city}, ${artisanData.state ? artisanData.state.slice(0, 2) : 'IN'}...`,
        fullLocation: `${artisanData.city}, ${artisanData.state || 'India'}`,
        badge: 'HANDMADE',
        image: artisanData.studioImage,
        category: artisanData.craft
      }
    ];
  }

  // Parse followers count
  let followersNum = 2450;
  if (typeof artisanData.followersCount === 'number') {
    followersNum = artisanData.followersCount;
  } else if (typeof artisanData.followersCount === 'string') {
    const raw = artisanData.followersCount.toLowerCase().trim();
    if (raw.includes('k')) {
      followersNum = Math.round(parseFloat(raw) * 1000);
    } else {
      followersNum = parseInt(raw, 10) || 2450;
    }
  }

  // Joined year calculation
  const joinedYear = artisanData.joinedYear || (
    artisanData.yearsOfExperience ? String(2026 - artisanData.yearsOfExperience) : '2020'
  );

  // Process Steps
  const steps = artisanData.processSteps && artisanData.processSteps.length > 0
    ? artisanData.processSteps.map((s, idx) => ({
        name: s.title || `Step ${idx + 1}`,
        desc: s.desc || '',
        image: idx === 0 ? (artisanData.workImage1 || artisanData.studioImage)
             : idx === 1 ? (artisanData.workImage2 || artisanData.studioImage)
             : artisanData.studioImage
      }))
    : [
        { name: 'Source', desc: 'Harvesting purest natural materials with ethical care.', image: artisanData.workImage1 || artisanData.studioImage },
        { name: 'Shape', desc: 'Shaping by hand using ancestral artisan techniques.', image: artisanData.workImage2 || artisanData.studioImage },
        { name: 'Refine', desc: 'Slow hand-carving, polishing and contour detail work.', image: artisanData.studioImage },
        { name: 'Cure', desc: 'Natural courtyard drying and mineral heat curing.', image: artisanData.workImage1 || artisanData.studioImage },
        { name: 'Finish', desc: 'Final botanical oil or ash glaze inspection.', image: artisanData.workImage2 || artisanData.studioImage }
      ];

  // Moments strip photos
  const moments = [
    artisanData.studioImage,
    artisanData.workImage1 || artisanData.studioImage,
    artisanData.workImage2 || artisanData.studioImage,
    artisanData.avatar,
    artisanData.workImage1 || artisanData.studioImage,
    artisanData.studioImage
  ].filter(Boolean);

  return {
    id: artId,
    name: artisanData.name,
    handle: artisanData.handle || `@${artisanData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    brandName: brandPill,
    craftSpecialty: artisanData.craftSpecialty || artisanData.craft,
    craft: artisanData.craft,
    city: artisanData.city,
    state: artisanData.state,
    joinedYear,
    yearsOfExperience: artisanData.yearsOfExperience || 6,
    rating: artisanData.rating || 4.8,
    reviewsCount: artisanData.reviewsCount || 168,
    followersCount: followersNum,
    creationsCount: productsList.length,
    avatar: artisanData.avatar,
    banner: artisanData.studioImage || artisanData.workImage1,
    bio: artisanData.quote || artisanData.bio,
    story: artisanData.story || artisanData.bio,
    specialties: artisanData.specialties || ['Handcrafted Form', 'Natural Materials', 'Ancestral Heritage'],
    processSteps: steps,
    moments,
    products: productsList,
    posts: [
      {
        id: `${artId}-post-1`,
        date: '2 days ago',
        caption: artisanData.quote
          ? `"${artisanData.quote}" — Live moments from our workshop in ${artisanData.city}.`
          : `Working on newly shaped creations right here in our workshop in ${artisanData.city}.`,
        image: artisanData.workImage1 || artisanData.studioImage,
        likes: Math.max(140, Math.round(followersNum * 0.14)),
        comments: Math.max(12, Math.round(followersNum * 0.02))
      }
    ]
  };
}

// Sidebar Trending in Crafting items (Screenshot 1)
const trendingCrafts = [
  {
    category: 'Trending in Pottery',
    tag: '#terracotta',
    count: '1,240 creations',
    navCategory: 'Pottery'
  },
  {
    category: 'Trending in Textiles',
    tag: '#handloom',
    count: '942 creations',
    navCategory: 'Textiles'
  },
  {
    category: 'Trending in Jewelry',
    tag: '#silver',
    count: '651 creations',
    navCategory: 'Jewelry'
  }
];

export default function ArtisanDetailsPage({
  artisanId,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onOpenProductModal,
  onNavigate,
  onGoBack,
  showToast
}) {
  const { t } = useLanguage();

  // 1. DYNAMICALLY RESOLVE ACTIVE ARTISAN
  const artisan = useMemo(() => {
    if (!artisanId) {
      const defaultFound = artisans.find((a) => a.id === 'arjun-mehta') || artisans[0];
      return formatArtisanProfile(defaultFound);
    }

    const query = String(artisanId).toLowerCase().trim();

    let found = artisans.find((a) => a.id?.toLowerCase() === query);

    if (!found) {
      found = artisans.find(
        (a) =>
          a.name.toLowerCase() === query ||
          a.name.toLowerCase().replace(/\s+/g, '-') === query ||
          a.name.toLowerCase().includes(query) ||
          query.includes(a.name.toLowerCase()) ||
          (a.handle && a.handle.toLowerCase().replace('@', '') === query.replace('@', ''))
      );
    }

    if (!found) {
      found = artisans.find((a) => a.id === 'arjun-mehta') || artisans[0];
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
        handle: a.handle || `@${a.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        verified: true,
        avatar: a.avatar
      }));
  }, [artisan?.id, artisan?.name]);

  // 3. INTERACTIVE COMPONENT STATES
  const [activeTab, setActiveTab] = useState('Products');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(artisan?.followersCount || 2450);
  const [followingSuggestedIds, setFollowingSuggestedIds] = useState({});

  // Inquiry Modal State
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // Reset scroll & followers on artisan switch
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setFollowersCount(artisan?.followersCount || 2450);
    setIsFollowing(false);
    setActiveTab('Products');
  }, [artisan?.id]);

  // Main Artisan Follow Toggle
  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount((prev) => (nextState ? prev + 1 : prev - 1));

    if (showToast) {
      showToast(
        nextState
          ? `You are now following ${artisan.name}`
          : `Unfollowed ${artisan.name}`
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
            : `Unfollowed ${makerName}`
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
          url
        });
        return;
      } catch (err) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      if (showToast) showToast('Profile link copied to clipboard!');
    } catch (e) {
      if (showToast) showToast('Share link: ' + url);
    }
  };

  // Submit Studio Inquiry Form
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryMessage.trim()) return;

    if (showToast) {
      showToast(`Your message has been sent to ${artisan.name}'s studio!`);
    }

    setInquiryName('');
    setInquiryEmail('');
    setInquiryMessage('');
    setIsInquiryOpen(false);
  };

  if (!artisan) return null;

  return (
    <main className="artisan-page-root animate-fade-in">
      <div className="ap-page-container">
        
        {/* ============================================================
            1. TOP NAVIGATION BAR (Back Button, Title & Breadcrumbs)
            ============================================================ */}
        <div className="ap-top-nav-row">
          <div className="ap-top-back-bar">
            <button
              className="ap-back-icon-btn"
              onClick={() => {
                if (onGoBack) onGoBack();
                else if (onNavigate) onNavigate('/makers');
                else window.history.back();
              }}
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="ap-top-maker-title-group">
              <div className="ap-top-maker-name-row">
                <span className="ap-top-maker-name">{artisan.name}</span>
                <CheckCircle2 size={16} className="ap-verified-check-icon" fill="#2563EB" color="#FFFFFF" />
              </div>
              <span className="ap-top-creations-count">
                {artisan.creationsCount} Creations
              </span>
            </div>
          </div>

          <nav className="ap-breadcrumb-list" aria-label="Breadcrumb navigation">
            <button className="ap-breadcrumb-btn" onClick={() => onNavigate && onNavigate('/')}>
              Home
            </button>
            <span>/</span>
            <button className="ap-breadcrumb-btn" onClick={() => onNavigate && onNavigate('/makers')}>
              Artisans
            </button>
            <span>/</span>
            <span className="ap-breadcrumb-active">{artisan.name}</span>
          </nav>
        </div>

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
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                  />
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
                    className={`ap-follow-pill-btn ${isFollowing ? 'following' : ''}`}
                    onClick={handleToggleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>

              {/* Profile Details Body */}
              <div className="ap-profile-body">
                
                {/* Name & Verified Badge */}
                <div className="ap-profile-name-row">
                  <h1 className="ap-profile-name">{artisan.name}</h1>
                  <CheckCircle2 size={20} className="ap-verified-check-icon" fill="#2563EB" color="#FFFFFF" />
                </div>

                {/* Handle */}
                <div className="ap-profile-handle">{artisan.handle}</div>

                {/* Brand Tag Pill & Specialty Italics */}
                <div className="ap-brand-tag-row">
                  <span className="ap-brand-pill">{artisan.brandName}</span>
                  <span className="ap-craft-desc-italics">{artisan.craftSpecialty}</span>
                </div>

                {/* Bio */}
                <p className="ap-profile-bio">{artisan.bio}</p>

                {/* Meta Row: Location, Joined Year, Rating */}
                <div className="ap-profile-meta-row">
                  <div className="ap-meta-detail">
                    <MapPin size={15} />
                    <span>{artisan.city}, {artisan.state}</span>
                  </div>

                  <div className="ap-meta-detail">
                    <Calendar size={15} />
                    <span>Joined {artisan.joinedYear}</span>
                  </div>

                  <div className="ap-meta-detail">
                    <Star size={15} className="ap-meta-rating-star" fill="#D97706" color="#D97706" />
                    <span className="ap-meta-rating-text">{artisan.rating}</span>
                    <span>Rating</span>
                  </div>
                </div>

                {/* Stats Row: Creations & Followers */}
                <div className="ap-profile-stats-row">
                  <div className="ap-stat-item-inline">
                    <span className="ap-stat-num">{artisan.creationsCount}</span>
                    <span className="ap-stat-lbl">Creations</span>
                  </div>

                  <div className="ap-stat-item-inline">
                    <span className="ap-stat-num">{followersCount.toLocaleString('en-IN')}</span>
                    <span className="ap-stat-lbl">Followers</span>
                  </div>

                  <div className="ap-stat-item-inline">
                    <span className="ap-stat-num">{artisan.reviewsCount}</span>
                    <span className="ap-stat-lbl">Reviews</span>
                  </div>
                </div>

              </div>
            </section>

            {/* NAVIGATION TABS */}
            <nav className="ap-nav-tabs-bar" aria-label="Artisan profile sections navigation">
              <button
                className={`ap-nav-tab-btn ${activeTab === 'Products' ? 'active' : ''}`}
                onClick={() => setActiveTab('Products')}
              >
                Products ({artisan.creationsCount})
              </button>

              <button
                className={`ap-nav-tab-btn ${activeTab === 'About' ? 'active' : ''}`}
                onClick={() => setActiveTab('About')}
              >
                About & Craft Process
              </button>

              <button
                className={`ap-nav-tab-btn ${activeTab === 'Posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('Posts')}
              >
                Studio Feed ({artisan.posts?.length || 1})
              </button>
            </nav>

            {/* TAB CONTENT: PRODUCTS */}
            {activeTab === 'Products' && (
              <div className="animate-fade-in">
                
                {/* 3-Column Products Grid (Screenshot 1) */}
                <div className="ap-tab-products-grid">
                  {artisan.products?.map((item) => {
                    const isWishlisted = wishlist.includes(item.id);

                    return (
                      <article key={item.id} className="ap-item-card">
                        
                        {/* Media Container */}
                        <div
                          className="ap-item-media"
                          onClick={() => onOpenProductModal && onOpenProductModal(item)}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                          />
                          <span className="ap-item-badge-pill">{item.badge || 'HANDMADE'}</span>
                          
                          <button
                            className="ap-item-wish-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWishlist && onToggleWishlist(item.id);
                            }}
                            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                          >
                            <Heart
                              size={16}
                              fill={isWishlisted ? '#A85838' : 'none'}
                              color={isWishlisted ? '#A85838' : 'currentColor'}
                            />
                          </button>
                        </div>

                        {/* Content Body */}
                        <div className="ap-item-body">
                          
                          <div className="ap-item-meta-top">
                            <span className="ap-item-brand">{item.brand}</span>
                            <div className="ap-item-rating">
                              <Star size={13} fill="#D97706" color="#D97706" />
                              <span>{item.rating}</span>
                            </div>
                          </div>

                          <h3
                            className="ap-item-title"
                            title={item.name}
                            onClick={() => onOpenProductModal && onOpenProductModal(item)}
                          >
                            {item.name}
                          </h3>

                          <div className="ap-item-price-loc-row">
                            <div className="ap-item-loc" title={item.fullLocation || item.location}>
                              <MapPin size={13} />
                              <span>{item.location}</span>
                            </div>

                            <div className="ap-item-price-wrap">
                              <span className="ap-item-price">
                                ₹{item.price.toLocaleString('en-IN')}
                              </span>
                              {item.originalPrice && (
                                <span className="ap-item-original-price">
                                  ₹{item.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            className="ap-item-view-btn"
                            onClick={() => onOpenProductModal && onOpenProductModal(item)}
                          >
                            VIEW CREATION
                          </button>

                        </div>

                      </article>
                    );
                  })}
                </div>

                {/* Dark Feature Collection Banner (Screenshot 2) */}
                <div className="ap-dark-collection-banner">
                  <div>
                    <h3 className="ap-dark-banner-title">
                      The {artisan.brandName} Signature Line
                    </h3>
                    <button
                      className="ap-btn-shop-collection"
                      onClick={() => onNavigate && onNavigate('/shop')}
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

              </div>
            )}

            {/* TAB CONTENT: ABOUT & PROCESS (Screenshot 2 Harmonized) */}
            {activeTab === 'About' && (
              <div className="animate-fade-in">
                
                {/* Split Meet the Maker Card */}
                <section className="ap-meet-card-section">
                  <div className="ap-meet-card">
                    <div className="ap-meet-media">
                      <img
                        src={artisan.banner}
                        alt={`${artisan.name} at work`}
                      />
                    </div>

                    <div className="ap-meet-content">
                      <span className="ap-meet-eyebrow">Meet {artisan.name.split(' ')[0]}</span>
                      <h2 className="ap-meet-title">Craft, patience, and human touch.</h2>
                      <p className="ap-meet-desc">
                        {artisan.story}
                      </p>

                      <div className="ap-meet-meta-row">
                        <div className="ap-meet-meta-item">
                          <MapPin size={18} className="ap-meet-meta-icon" />
                          <div>
                            <div className="ap-meta-label">{artisan.city}</div>
                            <div className="ap-meta-sub">Studio Workshop</div>
                          </div>
                        </div>

                        <div className="ap-meet-meta-item">
                          <Sparkles size={18} className="ap-meet-meta-icon" />
                          <div>
                            <div className="ap-meta-label">{artisan.craftSpecialty.split('&')[0].trim()}</div>
                            <div className="ap-meta-sub">Est. {artisan.joinedYear}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* About Specs Grid */}
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
                      <div className="ap-spec-val">{artisan.yearsOfExperience} Years</div>
                    </div>
                  </div>

                  <div className="ap-spec-item">
                    <MapPin size={16} className="ap-spec-icon" />
                    <div>
                      <div className="ap-spec-key">Workshop Location</div>
                      <div className="ap-spec-val">{artisan.city}, {artisan.state}</div>
                    </div>
                  </div>

                  <div className="ap-spec-item">
                    <Briefcase size={16} className="ap-spec-icon" />
                    <div>
                      <div className="ap-spec-key">Specialty</div>
                      <div className="ap-spec-val">{artisan.craftSpecialty}</div>
                    </div>
                  </div>

                  <div className="ap-spec-item">
                    <HeartHandshake size={16} className="ap-spec-icon" />
                    <div>
                      <div className="ap-spec-key">Studio Brand</div>
                      <div className="ap-spec-val">{artisan.brandName}</div>
                    </div>
                  </div>

                  <div className="ap-spec-item">
                    <Layers size={16} className="ap-spec-icon" />
                    <div>
                      <div className="ap-spec-key">Materials Used</div>
                      <div className="ap-spec-val">100% Sustainable & Hand-sourced</div>
                    </div>
                  </div>
                </div>

                {/* How It's Made: 5-Step Process */}
                <section className="ap-how-section">
                  <div className="ap-how-header">
                    <h3 className="ap-how-title">How It's Made</h3>
                    <span className="ap-how-subtitle">5-step artisan process from raw material to finished treasure</span>
                  </div>

                  <div className="ap-how-grid">
                    {artisan.processSteps.map((step, idx) => (
                      <div key={idx} className="ap-how-card">
                        <div className="ap-how-media">
                          <img src={step.image} alt={step.name} loading="lazy" />
                        </div>
                        <div className="ap-how-body">
                          <h4 className="ap-how-step-name">{step.name}</h4>
                          <p className="ap-how-step-desc">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Studio Moments Photo Strip */}
                <div>
                  <h3 className="ap-how-title" style={{ marginBottom: '1rem' }}>Studio Moments</h3>
                  <div className="ap-moments-strip">
                    {artisan.moments.map((img, idx) => (
                      <div key={idx} className="ap-moment-tile">
                        <img src={img} alt={`Studio moment ${idx + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: STUDIO FEED */}
            {activeTab === 'Posts' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {artisan.posts?.map((post) => (
                  <div
                    key={post.id}
                    className="ap-profile-card"
                    style={{ padding: '1.75rem', marginBottom: 0 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={artisan.avatar}
                          alt={artisan.name}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.96rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>{artisan.name}</span>
                            <CheckCircle2 size={14} fill="#2563EB" color="#FFFFFF" />
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{post.date}</div>
                        </div>
                      </div>
                      <MoreHorizontal size={18} color="var(--text-muted)" />
                    </div>

                    <p style={{ fontSize: '0.94rem', lineHeight: '1.65', color: 'var(--text-secondary)', marginBottom: '1.15rem' }}>
                      {post.caption}
                    </p>

                    {post.image && (
                      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '440px', marginBottom: '1.15rem', backgroundColor: 'var(--bg-secondary)' }}>
                        <img src={post.image} alt="Studio update" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.86rem', color: 'var(--text-muted)', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
                      <span>♡ {post.likes} Likes</span>
                      <span>💬 {post.comments} Comments</span>
                      <span style={{ marginLeft: 'auto', color: 'var(--accent-terracotta)', fontWeight: 600 }}>Artisan Verified Post</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* ----------------------------------------------------------
              RIGHT COLUMN: Sidebar ("You might like" & "Trending in Crafting")
              ---------------------------------------------------------- */}
          <aside className="ap-sidebar-column">
            
            {/* SIDEBAR CARD 1: You might like (Screenshot 1) */}
            <div className="ap-sidebar-card">
              <h2 className="ap-sidebar-card-title">You might like</h2>

              <div className="ap-suggested-makers-list">
                {suggestedMakers.map((maker) => (
                  <div key={maker.id} className="ap-suggested-maker-row">
                    
                    <div
                      className="ap-sugg-author-info"
                      onClick={() => onNavigate && onNavigate(`/artisan?id=${maker.id}`)}
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
                            <CheckCircle2 size={13} fill="#2563EB" color="#FFFFFF" />
                          )}
                        </div>
                        <span className="ap-sugg-handle">{maker.handle}</span>
                      </div>
                    </div>

                    <button
                      className={`ap-sugg-follow-btn ${followingSuggestedIds[maker.id] ? 'following' : ''}`}
                      onClick={() => handleToggleSuggestedFollow(maker.id, maker.name)}
                    >
                      {followingSuggestedIds[maker.id] ? 'Following' : 'Follow'}
                    </button>

                  </div>
                ))}
              </div>

              <button
                className="ap-sidebar-show-more-btn"
                onClick={() => onNavigate && onNavigate('/makers')}
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
                      onClick={() => onNavigate && onNavigate('/shop')}
                    >
                      {trend.tag}
                    </span>
                    <span className="ap-trend-count">{trend.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDEBAR CARD 3: Studio Handcrafted Guarantee */}
            <div className="ap-sidebar-card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                Craftinator Verified Studio
              </h3>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Every piece from {artisan.name}'s studio is made slowly and authentically with verifiable provenance.
              </p>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-terracotta)', fontWeight: 700 }}>
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
              Ask about custom commissions, dimensions, or custom order requests directly from {artisan.brandName}.
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
