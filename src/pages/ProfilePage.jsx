import React, { useState } from 'react';
import { 
  User, 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Package, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Share2, 
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { products } from '../data/products';
import { artisans } from '../data/artisans';

export default function ProfilePage({
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onOpenProductModal,
  onOpenArtisanModal,
  onNavigate,
  onGoBack,
  showToast
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'wishlist' | 'artisans' | 'perks'

  // Filter wishlisted products from global products dataset
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  // Mock authentic handcrafted orders
  const orders = [
    {
      id: 'CRFT-84920',
      date: 'Sep 12, 2026',
      status: 'Delivered',
      artisan: artisans[0]?.name || 'Elena Rostova',
      item: products[0]?.name || 'Nordic Glazed Ceramic Vase',
      image: products[0]?.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=300&auto=format&fit=crop',
      price: products[0]?.price || 84,
      material: products[0]?.material || 'Hand-thrown Stoneware'
    },
    {
      id: 'CRFT-72104',
      date: 'Aug 28, 2026',
      status: 'In Transit',
      artisan: artisans[1]?.name || 'Mateo Morales',
      item: products[2]?.name || 'Scented Soy Botanical Candle',
      image: products[2]?.image || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=300&auto=format&fit=crop',
      price: products[2]?.price || 42,
      material: products[2]?.material || '100% Organic Soy'
    }
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    if (showToast) showToast('Profile link copied to clipboard!');
  };

  return (
    <div className="profile-page-root">
      <div className="container profile-container">
        
        {/* Top Navigation Bar */}
        <div className="profile-top-bar">
          <button 
            type="button"
            className="profile-back-btn" 
            onClick={() => {
              if (onGoBack) onGoBack();
              else if (onNavigate) onNavigate('/');
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span>{t('btn_back', 'Back')}</span>
          </button>

          <button
            type="button"
            className="profile-share-btn"
            onClick={handleShare}
            aria-label="Share profile"
            title="Share profile"
          >
            <Share2 size={16} />
            <span>{t('share', 'Share')}</span>
          </button>
        </div>

        {/* User Hero Banner & Card */}
        <div className="profile-card">
          <div className="profile-card-cover">
            <div className="profile-card-badge">
              <Award size={14} />
              <span>Artisan Patron • Tier II</span>
            </div>
          </div>

          <div className="profile-card-header">
            <div className="profile-avatar-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop" 
                alt="Member Profile" 
                className="profile-avatar-img"
              />
              <span className="profile-verified-dot" title="Verified Collector">
                <CheckCircle2 size={16} />
              </span>
            </div>

            <div className="profile-main-meta">
              <div className="profile-name-row">
                <h1 className="profile-display-name">Aarav Sharma</h1>
                <span className="profile-handle">@aarav_crafts</span>
              </div>
              <p className="profile-bio">
                Collector of heritage pottery, organic linen & woodworks. Passionate supporter of indigenous master craftspeople across the globe.
              </p>
              <div className="profile-tags-row">
                <span className="profile-meta-item">
                  <MapPin size={14} /> Portland, OR, USA
                </span>
                <span className="profile-meta-item">
                  <Calendar size={14} /> Member since 2024
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="profile-stats-grid">
            <div className="profile-stat-box" onClick={() => setActiveTab('orders')}>
              <span className="profile-stat-number">{orders.length}</span>
              <span className="profile-stat-label">{t('my_orders', 'Orders')}</span>
            </div>
            <div className="profile-stat-box" onClick={() => setActiveTab('wishlist')}>
              <span className="profile-stat-number">{wishlist.length}</span>
              <span className="profile-stat-label">{t('wishlist', 'Saved Crafts')}</span>
            </div>
            <div className="profile-stat-box" onClick={() => setActiveTab('artisans')}>
              <span className="profile-stat-number">{artisans.length}</span>
              <span className="profile-stat-label">Artisans Followed</span>
            </div>
            <div className="profile-stat-box" onClick={() => setActiveTab('perks')}>
              <span className="profile-stat-number">100%</span>
              <span className="profile-stat-label">Fair Trade Impact</span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="profile-tabs-strip">
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={16} />
              <span>{t('my_orders', 'Orders & Deliveries')}</span>
              <span className="profile-tab-badge">{orders.length}</span>
            </button>
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <Heart size={16} />
              <span>{t('wishlist_title', 'Saved Wishlist')}</span>
              <span className="profile-tab-badge">{wishlist.length}</span>
            </button>
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'artisans' ? 'active' : ''}`}
              onClick={() => setActiveTab('artisans')}
            >
              <Sparkles size={16} />
              <span>Makers Supported</span>
            </button>
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'perks' ? 'active' : ''}`}
              onClick={() => setActiveTab('perks')}
            >
              <Award size={16} />
              <span>Patron Perks</span>
            </button>
          </div>
        </div>

        {/* Tab Content Section */}
        <div className="profile-tab-content">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="profile-orders-list">
              <h2 className="profile-section-title">Your Handcrafted Purchases</h2>
              {orders.map((order) => (
                <div key={order.id} className="profile-order-card">
                  <img src={order.image} alt={order.item} className="profile-order-img" />
                  <div className="profile-order-info">
                    <div className="profile-order-header">
                      <span className="profile-order-id">{order.id}</span>
                      <span className={`profile-status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="profile-order-title">{order.item}</h3>
                    <p className="profile-order-maker">Handcrafted by <strong>{order.artisan}</strong></p>
                    <div className="profile-order-meta">
                      <span>Ordered on {order.date}</span>
                      <span>•</span>
                      <span>{order.material}</span>
                      <span>•</span>
                      <strong>${order.price}.00</strong>
                    </div>
                  </div>
                  <div className="profile-order-action">
                    <button 
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (showToast) showToast(`Tracking dispatched for ${order.id}`);
                      }}
                    >
                      Track Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="profile-wishlist-view">
              <div className="profile-section-header">
                <h2 className="profile-section-title">Saved Wishlist ({wishlistedProducts.length})</h2>
                {wishlistedProducts.length > 0 && (
                  <button 
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (onNavigate) onNavigate('/shop');
                    }}
                  >
                    Browse More Crafts →
                  </button>
                )}
              </div>

              {wishlistedProducts.length === 0 ? (
                <div className="profile-empty-state">
                  <Heart size={44} className="profile-empty-icon" />
                  <h3>No saved crafts yet</h3>
                  <p>Discover one-of-a-kind handmade crafts and click the heart icon to save them.</p>
                  <button 
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (onNavigate) onNavigate('/shop');
                    }}
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                <div className="profile-wishlist-grid">
                  {wishlistedProducts.map((prod) => (
                    <div key={prod.id} className="profile-wish-card">
                      <div className="profile-wish-img-box">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="profile-wish-img"
                          onClick={() => onOpenProductModal && onOpenProductModal(prod)}
                        />
                      </div>
                      <div className="profile-wish-body">
                        <h3 
                          className="profile-wish-title"
                          onClick={() => onOpenProductModal && onOpenProductModal(prod)}
                        >
                          {prod.name}
                        </h3>
                        <p className="profile-wish-price">${prod.price}.00</p>
                        <div className="profile-wish-actions">
                          <button 
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => onAddToCart && onAddToCart(prod)}
                          >
                            <ShoppingBag size={14} /> Add to Cart
                          </button>
                          <button 
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onToggleWishlist && onToggleWishlist(prod.id)}
                            title="Remove from saved"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ARTISANS */}
          {activeTab === 'artisans' && (
            <div className="profile-artisans-view">
              <h2 className="profile-section-title">Master Artisans You Follow</h2>
              <div className="profile-artisans-grid">
                {artisans.map((artisan) => (
                  <div key={artisan.id} className="profile-artisan-card">
                    <img src={artisan.avatar} alt={artisan.name} className="profile-artisan-avatar" />
                    <div className="profile-artisan-info">
                      <h3 className="profile-artisan-name">{artisan.name}</h3>
                      <p className="profile-artisan-craft">{artisan.craft || artisan.discipline} • {artisan.city}, {artisan.country}</p>
                    </div>
                    <button 
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisan)}
                    >
                      View Studio <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERKS */}
          {activeTab === 'perks' && (
            <div className="profile-perks-view">
              <h2 className="profile-section-title">Patron Member Benefits</h2>
              <div className="profile-perks-grid">
                <div className="profile-perk-card">
                  <div className="profile-perk-icon"><Sparkles size={24} /></div>
                  <h3>Early Access to Studio Drops</h3>
                  <p>Get 24-hour priority access before limited-edition studio drops are opened to the public.</p>
                </div>
                <div className="profile-perk-card">
                  <div className="profile-perk-icon"><Award size={24} /></div>
                  <h3>100% Carbon-Neutral Shipping</h3>
                  <p>All your orders are shipped with recycled organic paper and verified climate offset credits.</p>
                </div>
                <div className="profile-perk-card">
                  <div className="profile-perk-icon"><CheckCircle2 size={24} /></div>
                  <h3>Handcrafted Certificate of Authenticity</h3>
                  <p>Every piece includes a signed physical provenance stamp from the master maker.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
