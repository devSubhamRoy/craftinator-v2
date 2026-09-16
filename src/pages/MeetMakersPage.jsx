import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  UserPlus,
  Check,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  X,
  ChevronDown,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { artisans } from '../data/artisans';
import { products } from '../data/products';
import Newsletter from '../components/sections/Newsletter';

export default function MeetMakersPage({
  onOpenArtisanModal,
  onOpenProductModal,
  onNavigate,
  showToast
}) {
  const { t } = useLanguage();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraftPill, setSelectedCraftPill] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [followingArtisans, setFollowingArtisans] = useState({});

  // 12 Visual Craft Categories for "Explore by Craft" Section
  const craftExploreItems = [
    {
      name: 'Pottery & Ceramics',
      count: '34 Artisans',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Ceramic'
    },
    {
      name: 'Jewelry',
      count: '45 Artisans',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Jewelry'
    },
    {
      name: 'Woodcraft',
      count: '28 Artisans',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Woodcraft'
    },
    {
      name: 'Textiles',
      count: '38 Artisans',
      image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Textile'
    },
    {
      name: 'Leather',
      count: '25 Artisans',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Leather'
    },
    {
      name: 'Painting',
      count: '19 Artisans',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Painting'
    },
    {
      name: 'Printmaking',
      count: '16 Artisans',
      image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Printmaking'
    },
    {
      name: 'Candles',
      count: '26 Artisans',
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Chandler'
    },
    {
      name: 'Basketry',
      count: '22 Artisans',
      image: 'https://images.unsplash.com/photo-1509695503492-413bc9d28d77?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Basketry'
    },
    {
      name: 'Metalwork',
      count: '31 Artisans',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Metalsmith'
    },
    {
      name: 'Glass',
      count: '14 Artisans',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Glass'
    },
    {
      name: 'Traditional Crafts',
      count: '42 Artisans',
      image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=400&auto=format&fit=crop',
      filterKey: 'Traditional'
    }
  ];

  // 6 Technique Strip Cards for "Crafts That Carry Generations"
  const generationsCrafts = [
    {
      title: 'Handloom Weaving',
      desc: 'Ancestral wooden pit loom techniques',
      image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?q=80&w=400&auto=format&fit=crop',
      craftKey: 'Textile'
    },
    {
      title: 'Blue Pottery',
      desc: 'Quartz and fuller clay glaze artistry',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop',
      craftKey: 'Ceramic'
    },
    {
      title: 'Wood Carving',
      desc: 'Root-cut seasoned timber relief',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop',
      craftKey: 'Woodcraft'
    },
    {
      title: 'Block Printing',
      desc: 'Hand-carved teak wood botanical stamps',
      image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=400&auto=format&fit=crop',
      craftKey: 'Textile'
    },
    {
      title: 'Terracotta',
      desc: 'Sacred riverbed earthenware firing',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=400&auto=format&fit=crop',
      craftKey: 'Ceramic'
    },
    {
      title: 'Metal Craft',
      desc: 'Lost-wax Chola bronze bell casting',
      image: 'https://images.unsplash.com/photo-1509695503492-413bc9d28d77?q=80&w=400&auto=format&fit=crop',
      craftKey: 'Metalsmith'
    }
  ];

  // Filter Pills for Search Toolbar
  const filterPills = [
    'All',
    'Pottery',
    'Jewelry',
    'Woodcraft',
    'Textiles',
    'Leather',
    'Painting',
    'Home Decor'
  ];

  // Toggle Follow Artisan Handler
  const handleToggleFollow = (e, artisanId, artisanName) => {
    e.stopPropagation();
    const isNowFollowing = !followingArtisans[artisanId];
    setFollowingArtisans(prev => ({
      ...prev,
      [artisanId]: isNowFollowing
    }));

    if (showToast) {
      showToast(
        isNowFollowing
          ? `You are now following ${artisanName}`
          : `Unfollowed ${artisanName}`
      );
    }
  };

  // Filtered Artisans for "All Artisans" directory
  const filteredArtisans = useMemo(() => {
    return artisans.filter(artisan => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          artisan.name.toLowerCase().includes(q) ||
          artisan.craft.toLowerCase().includes(q) ||
          artisan.city.toLowerCase().includes(q) ||
          artisan.state.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Filter Pill
      if (selectedCraftPill !== 'All') {
        const pill = selectedCraftPill.toLowerCase();
        const craft = artisan.craft.toLowerCase();
        if (!craft.includes(pill)) {
          if (selectedCraftPill === 'Pottery' && !craft.includes('ceramic')) return false;
          if (selectedCraftPill === 'Home Decor' && !craft.includes('chandler') && !craft.includes('woodcraft')) return false;
        }
      }

      // Location Filter
      if (selectedLocation !== 'all') {
        if (artisan.state !== selectedLocation) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCraftPill, selectedLocation]);

  // Featured 4 Artisans for "Artisans Worth Discovering"
  const featuredArtisans = artisans.slice(0, 4);

  // Spotlight Maker (Maya Sharma)
  const mayaSpotlight = artisans[0];

  return (
    <div className="makers-page-root animate-fade-in">
      
      {/* ============================================================
          1. HERO SECTION (Split Text & Collage Grid)
          ============================================================ */}
      <section className="mm-hero-section">
        <div className="container">
          <div className="mm-hero-grid">
            
            {/* Left Hero Content */}
            <div className="mm-hero-text">
              <span className="mm-eyebrow">{t('nav_makers', 'MEET THE MAKERS')}</span>
              <h1 className="mm-hero-title">
                {t('makers_hero_title', 'Meet the Hands Behind the Craft.')}
              </h1>
              <p className="mm-hero-desc">
                {t('makers_hero_desc', 'Discover independent artisans, makers and creative minds turning traditional skills and personal stories into beautiful things made by hand.')}
              </p>
              
              <div className="mm-hero-ctas">
                <button
                  className="btn btn-terracotta"
                  onClick={() => {
                    const el = document.getElementById('all-artisans-directory');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>{t('explore_artisans', 'Explore Artisans')}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])}
                >
                  <span>{t('become_artisan', 'Become an Artisan')}</span>
                </button>
              </div>

              <span className="mm-hero-subtext">
                Real people. Real craft. Real stories.
              </span>
            </div>

            {/* Right Collage Grid with Floating Badges */}
            <div className="mm-collage-container">
              {/* Floating Badge Top Left */}
              <div className="mm-floating-badge mm-badge-top-left">
                <Sparkles size={14} style={{ color: 'var(--accent-terracotta)' }} />
                <span>1,200+ Independent Artisans</span>
              </div>

              <div className="mm-collage-grid">
                {/* Main Potter Tile */}
                <div className="mm-collage-tile mm-tile-main">
                  <img
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop"
                    alt="Master Potter in studio"
                  />
                </div>
                {/* Wood Spoons */}
                <div className="mm-collage-tile">
                  <img
                    src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop"
                    alt="Hand carved wood spoons"
                  />
                </div>
                {/* Clay Bowls */}
                <div className="mm-collage-tile">
                  <img
                    src="https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=400&auto=format&fit=crop"
                    alt="Ceramic clay bowls"
                  />
                </div>
                {/* Botanical Pendant */}
                <div className="mm-collage-tile">
                  <img
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop"
                    alt="Hand hammered jewelry"
                  />
                </div>
                {/* Scented Candle */}
                <div className="mm-collage-tile">
                  <img
                    src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop"
                    alt="Soy candle flame"
                  />
                </div>
              </div>

              {/* Floating Badge Bottom Right */}
              <div className="mm-floating-badge mm-badge-bottom-right">
                <Award size={14} style={{ color: 'var(--bg-sage)' }} />
                <span>Crafted with a personal touch</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          2. SEARCH & FILTER BAR ("Find an Artisan You'll Love")
          ============================================================ */}
      <section className="mm-search-filter-section">
        <div className="container">
          <div className="mm-search-box-wrapper">
            <h2 className="mm-search-title">
              {t('find_artisan_title', "Find an Artisan You'll Love")}
            </h2>

            {/* Big Search Input */}
            <div className="mm-search-input-box">
              <Search size={18} className="mm-search-icon" />
              <input
                type="text"
                className="mm-search-input"
                placeholder={t('search_makers_placeholder', 'Search artisans, crafts, techniques or locations...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="mm-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Pills & Dropdowns */}
            <div className="mm-filter-row">
              {filterPills.map(pill => (
                <button
                  key={pill}
                  className={`mm-chip ${selectedCraftPill === pill ? 'active' : ''}`}
                  onClick={() => setSelectedCraftPill(pill)}
                >
                  {pill}
                </button>
              ))}

              <select
                className="mm-dropdown-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filter by Location"
              >
                <option value="all">Location ▾</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Goa">Goa</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Jammu & Kashmir">Kashmir</option>
                <option value="Uttarakhand">Uttarakhand</option>
              </select>

              <select className="mm-dropdown-select" aria-label="Filter by Style">
                <option value="all">Style ▾</option>
                <option value="organic">Organic Stoneware</option>
                <option value="heritage">Heritage Woodcraft</option>
                <option value="botanical">Botanical Metals</option>
                <option value="handloom">Handloom Silks</option>
              </select>

              <select className="mm-dropdown-select" aria-label="Filter by Experience">
                <option value="all">Experience ▾</option>
                <option value="15+">15+ Years</option>
                <option value="10+">10+ Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          3. FEATURED MAKERS ("Artisans Worth Discovering")
          ============================================================ */}
      <section className="mm-section">
        <div className="container">
          
          <div className="mm-section-header">
            <span className="mm-eyebrow">FEATURED MAKERS</span>
            <h2 className="mm-section-title">Artisans Worth Discovering</h2>
            <p className="mm-section-subtitle">
              Meet creators whose work, stories and craftsmanship stand out.
            </p>
          </div>

          <div className="mm-featured-grid">
            {featuredArtisans.map(artisan => {
              const isFollowing = !!followingArtisans[artisan.id];

              return (
                <div
                  key={artisan.id}
                  className="mm-featured-card card-hover-lift"
                  onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisan)}
                >
                  <div className="mm-featured-media">
                    <img
                      src={artisan.studioImage}
                      alt={`${artisan.name} working`}
                      loading="lazy"
                    />
                  </div>

                  <div className="mm-featured-body">
                    <div className="mm-featured-author-row">
                      <div className="mm-featured-avatar-info">
                        <img
                          src={artisan.avatar}
                          alt={artisan.name}
                          className="mm-featured-avatar"
                        />
                        <div>
                          <h3 className="mm-featured-name">{artisan.name}</h3>
                          <span className="mm-featured-craft">{artisan.craft}, {artisan.city}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`mm-follow-pill ${isFollowing ? 'following' : ''}`}
                        onClick={(e) => handleToggleFollow(e, artisan.id, artisan.name)}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>

                    <p className="mm-featured-snippet">
                      {artisan.bio}
                    </p>

                    <div className="mm-featured-footer">
                      <span className="mm-featured-stats">
                        48 Followers • {artisan.productsCount} Works
                      </span>
                      <span className="mm-featured-link">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================
          4. EXPLORE BY CRAFT (12 Craft Visual Tiles)
          ============================================================ */}
      <section className="mm-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-warm)', borderBottom: '1px solid var(--border-warm)' }}>
        <div className="container">
          
          <div className="mm-section-header">
            <h2 className="mm-section-title">Explore by Craft</h2>
            <p className="mm-section-subtitle">
              Find makers who speak your language of creativity.
            </p>
          </div>

          <div className="mm-craft-grid">
            {craftExploreItems.map((item, idx) => (
              <div
                key={idx}
                className="mm-craft-tile"
                onClick={() => {
                  setSelectedCraftPill(item.filterKey === 'Ceramic' ? 'Pottery' : (item.filterKey === 'Woodcraft' ? 'Woodcraft' : (item.filterKey === 'Jewelry' ? 'Jewelry' : 'All')));
                  const el = document.getElementById('all-artisans-directory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="mm-craft-overlay">
                  <h3 className="mm-craft-name">{item.name}</h3>
                  <span className="mm-craft-count">{item.count}</span>
                  <span className="mm-craft-action">Discover →</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================
          5. ALL ARTISANS DIRECTORY ("All Artisans")
          ============================================================ */}
      <section className="mm-section" id="all-artisans-directory">
        <div className="container">
          
          <div className="mm-section-header">
            <h2 className="mm-section-title">All Artisans</h2>
            <p className="mm-section-subtitle">
              Discover independent makers from across India and beyond.
            </p>
          </div>

          {/* Directory Toolbar */}
          <div className="mm-directory-toolbar">
            <div className="mm-toolbar-filters">
              <button className="mm-toolbar-btn">
                <Search size={14} />
                <span>Search</span>
              </button>

              <button className="mm-toolbar-btn">
                <Filter size={14} />
                <span>Filter</span>
              </button>

              <select
                className="mm-dropdown-select"
                value={selectedCraftPill}
                onChange={(e) => setSelectedCraftPill(e.target.value)}
              >
                <option value="All">Craft ▾</option>
                <option value="Pottery">Pottery & Ceramics</option>
                <option value="Woodcraft">Woodcraft</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Textiles">Textiles</option>
                <option value="Leather">Leather</option>
              </select>

              <select
                className="mm-dropdown-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">Location ▾</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Jammu & Kashmir">Kashmir</option>
              </select>

              <select className="mm-dropdown-select">
                <option>Style ▾</option>
                <option>Organic</option>
                <option>Minimalist</option>
                <option>Heritage</option>
              </select>

              <select className="mm-dropdown-select">
                <option>Materials ▾</option>
                <option>Clay</option>
                <option>Teak Wood</option>
                <option>Mulberry Silk</option>
                <option>Recycled Silver</option>
              </select>

              <select className="mm-dropdown-select">
                <option>Experience ▾</option>
                <option>15+ yrs</option>
                <option>10+ yrs</option>
              </select>

              <select className="mm-dropdown-select">
                <option>Availability ▾</option>
                <option>Ready to Ship</option>
                <option>Custom Order</option>
              </select>
            </div>

            <div className="mm-toolbar-count">
              {filteredArtisans.length} artisans
            </div>
          </div>

          {/* Artisans Grid */}
          <div className="mm-artisans-grid">
            {filteredArtisans.map(artisan => {
              const isFollowing = !!followingArtisans[artisan.id];

              return (
                <div
                  key={artisan.id}
                  className="mm-artisan-card card-hover-lift"
                  onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisan)}
                >
                  <div className="mm-artisan-media">
                    <img
                      src={artisan.studioImage}
                      alt={artisan.name}
                      loading="lazy"
                    />
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="mm-artisan-avatar-badge"
                    />
                    <span className="mm-artisan-verified">
                      <ShieldCheck size={13} />
                      Verified
                    </span>
                  </div>

                  <div className="mm-artisan-body">
                    <div className="mm-artisan-title-row">
                      <h3 className="mm-artisan-name">{artisan.name}</h3>
                    </div>
                    <span className="mm-artisan-role">{artisan.craft}</span>
                    <span className="mm-artisan-loc">
                      <MapPin size={12} />
                      {artisan.city}, {artisan.state}
                    </span>

                    <div className="mm-artisan-footer">
                      <span className="mm-artisan-rating">
                        <Star size={13} />
                        4.8 ({artisan.productsCount * 3} followers)
                      </span>

                      <button
                        type="button"
                        className={`mm-follow-pill ${isFollowing ? 'following' : ''}`}
                        onClick={(e) => handleToggleFollow(e, artisan.id, artisan.name)}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================
          6. SPOTLIGHT & SOCIAL FEED ("Meet Maya" & Community Posts)
          ============================================================ */}
      <section className="mm-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-warm)' }}>
        <div className="container">
          
          <div className="mm-spotlight-feed-grid">
            
            {/* Meet Maya Card */}
            {mayaSpotlight && (
              <div className="mm-maya-spotlight-card">
                <div className="mm-maya-media">
                  <img
                    src={mayaSpotlight.studioImage}
                    alt="Maya Sharma working with clay"
                  />
                </div>
                <div className="mm-maya-body">
                  <h3 className="mm-maya-title">Meet Maya</h3>
                  <p className="mm-maya-quote">
                    "Clay, patience and a little imperfection."
                  </p>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    Discover independent artisans, makers and creative minds turning raw materials into slow treasures.
                  </p>

                  <div className="mm-maya-stats-row">
                    <div className="mm-maya-stat">
                      <span className="mm-maya-stat-num">48</span>
                      <span className="mm-maya-stat-lbl">Creations</span>
                    </div>
                    <div className="mm-maya-stat">
                      <span className="mm-maya-stat-num">2.8k</span>
                      <span className="mm-maya-stat-lbl">Followers</span>
                    </div>
                    <div className="mm-maya-stat">
                      <span className="mm-maya-stat-num">4.9</span>
                      <span className="mm-maya-stat-lbl">Rating</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                      onClick={() => onOpenArtisanModal && onOpenArtisanModal(mayaSpotlight)}
                    >
                      <span>View Maya's Studio</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      className={`mm-follow-pill ${followingArtisans[mayaSpotlight.id] ? 'following' : ''}`}
                      style={{ padding: '0.65rem 1.1rem' }}
                      onClick={(e) => handleToggleFollow(e, mayaSpotlight.id, mayaSpotlight.name)}
                    >
                      {followingArtisans[mayaSpotlight.id] ? 'Following' : 'Follow Artisan'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Social Post 1 */}
            <div className="mm-social-post-card">
              <div className="mm-social-header">
                <div className="mm-social-user">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
                    alt="Maya Avatar"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span>@mayaceramics</span>
                </div>
                <button className="mm-follow-pill">Follow</button>
              </div>

              <div className="mm-social-media">
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop"
                  alt="Ceramic cup glaze test"
                />
              </div>

              <div className="mm-social-body">
                <p className="mm-social-caption">
                  Maya experimentation for cup production with mineral ash glaze.
                </p>
                <div className="mm-social-actions">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Heart size={14} /> 249
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MessageCircle size={14} /> 32
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Share2 size={14} /> 87
                  </span>
                </div>
              </div>
            </div>

            {/* Social Post 2 */}
            <div className="mm-social-post-card">
              <div className="mm-social-header">
                <div className="mm-social-user">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                    alt="Arjun Avatar"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span>@arjundascrafts</span>
                </div>
                <button className="mm-follow-pill">Follow</button>
              </div>

              <div className="mm-social-media">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop"
                  alt="Arjun carving rosewood bowl"
                />
              </div>

              <div className="mm-social-body">
                <p className="mm-social-caption">
                  Arjun carving rosewood heirloom serving bowl from reclaimed timber.
                </p>
                <div className="mm-social-actions">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Heart size={14} /> 186
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MessageCircle size={14} /> 21
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Share2 size={14} /> 54
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          7. REGIONAL CRAFT MAP & STORY SPLIT
          ============================================================ */}
      <section className="mm-section">
        <div className="container">
          
          <div className="mm-map-story-grid">
            
            {/* Story Card */}
            <div className="mm-story-card">
              <div className="mm-story-card-body">
                <h2 className="mm-story-card-title">
                  Every Pair of Hands Has a Story.
                </h2>
                <p className="mm-story-card-desc">
                  Behind every handmade object is a person who chose to make it differently with respect for raw materials and human patience.
                </p>
                <button
                  className="btn btn-terracotta"
                  onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])}
                >
                  <span>Explore Artisan Stories</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
                alt="Artisan sculpting"
                className="mm-story-card-img"
              />
            </div>

            {/* Interactive Craft Map Card */}
            <div className="mm-map-card">
              <h2 className="mm-story-card-title">
                Craft Has a Place.
              </h2>
              <p className="mm-story-card-desc" style={{ marginBottom: '1rem' }}>
                Discover artisans and traditional crafts from different corners of the land.
              </p>

              <div className="mm-map-interactive-box">
                {/* Regional Pins */}
                <div className="mm-map-pin mm-pin-rajasthan" onClick={() => setSelectedLocation('Rajasthan')}>
                  <span className="mm-pin-dot" />
                  <span>Rajasthan • Ceramics</span>
                </div>

                <div className="mm-map-pin mm-pin-kashmir" onClick={() => setSelectedLocation('Jammu & Kashmir')}>
                  <span className="mm-pin-dot" />
                  <span>Kashmir • Walnut Wood</span>
                </div>

                <div className="mm-map-pin mm-pin-bengal" onClick={() => setSelectedLocation('West Bengal')}>
                  <span className="mm-pin-dot" />
                  <span>West Bengal • Leather</span>
                </div>

                <div className="mm-map-pin mm-pin-odisha" onClick={() => setSelectedLocation('all')}>
                  <span className="mm-pin-dot" />
                  <span>Odisha • Dokra Metal</span>
                </div>

                <div className="mm-map-pin mm-pin-tamil" onClick={() => setSelectedLocation('Tamil Nadu')}>
                  <span className="mm-pin-dot" />
                  <span>Tamil Nadu • Bronze & Silks</span>
                </div>

                <div className="mm-map-pin mm-pin-kerala" onClick={() => setSelectedLocation('all')}>
                  <span className="mm-pin-dot" />
                  <span>Kerala • Teak Wood</span>
                </div>

                <div className="mm-map-pin mm-pin-assam" onClick={() => setSelectedLocation('all')}>
                  <span className="mm-pin-dot" />
                  <span>Assam • Bamboo Cane</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          8. CRAFTS THAT CARRY GENERATIONS (6 Strip Cards)
          ============================================================ */}
      <section className="mm-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-warm)' }}>
        <div className="container">
          
          <div className="mm-section-header">
            <h2 className="mm-section-title">Crafts That Carry Generations</h2>
            <p className="mm-section-subtitle">
              Discover techniques passed from one generation to the next.
            </p>
          </div>

          <div className="mm-generations-grid">
            {generationsCrafts.map((craft, idx) => (
              <div
                key={idx}
                className="mm-gen-card"
                onClick={() => {
                  const el = document.getElementById('all-artisans-directory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={craft.image} alt={craft.title} loading="lazy" />
                <div className="mm-gen-overlay">
                  <h3 className="mm-gen-title">{craft.title}</h3>
                  <span className="mm-gen-link">Discover Artisans →</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================
          9. SELLER ONBOARDING TERRACOTTA RIBBON
          ============================================================ */}
      <section className="container">
        <div className="mm-seller-banner">
          <div className="mm-seller-grid">
            <div className="mm-seller-body">
              <h2 className="mm-seller-title">
                Your Craft Deserves To Be Discovered.
              </h2>
              <p className="mm-seller-desc">
                Join a community of independent makers, showcase your work, connect directly with customers and grow your creative business.
              </p>

              <div className="mm-seller-ctas">
                <button
                  className="btn btn-white"
                  onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])}
                >
                  <span>Become an Artisan</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.4)' }}
                  onClick={() => {
                    const el = document.getElementById('all-artisans-directory');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Learn How It Works</span>
                </button>
              </div>

              <div className="mm-seller-steps-bar">
                <div>Create Your Profile</div>
                <div>Showcase Your Craft</div>
                <div>Build Your Community</div>
                <div>Reach New Customers</div>
              </div>
            </div>

            <div className="mm-seller-media">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop"
                alt="Artisan studio workspace"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. TESTIMONIALS ("Made by Makers. Loved by People.")
          ============================================================ */}
      <section className="mm-section">
        <div className="container">
          
          <div className="mm-section-header">
            <h2 className="mm-section-title">Made by Makers. Loved by People.</h2>
          </div>

          <div className="mm-testimonials-grid">
            <div className="mm-testimonial-card">
              <p className="mm-test-quote">
                "Maya Sharma, experimental studio potter, created slow stoneware sets that transformed our home dining table into everyday art."
              </p>
              <div className="mm-test-author">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
                  alt="Maya Sharma"
                  className="mm-test-avatar"
                />
                <span>Maya Sharma, Jaipur</span>
              </div>
            </div>

            <div className="mm-testimonial-card">
              <p className="mm-test-quote">
                "The stories behind each piece and the direct artisan connection give Craftinator goods soul you can feel in your hands."
              </p>
              <div className="mm-test-author">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                  alt="Ananya R."
                  className="mm-test-avatar"
                />
                <span>Ananya R., Bangalore</span>
              </div>
            </div>

            <div className="mm-testimonial-card">
              <p className="mm-test-quote">
                "For a community of independent craft makers, direct fair trade empowers our workshops and preserves ancient heritage."
              </p>
              <div className="mm-test-author">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                  alt="Rahul M."
                  className="mm-test-avatar"
                />
                <span>Rahul M., Kolkata</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          11. NEWSLETTER ("Stay Close to the Craft")
          ============================================================ */}
      <Newsletter
        onSubscribe={(email) => showToast && showToast(`Subscribed ${email} to Craftinator Community`)}
      />

    </div>
  );
}
