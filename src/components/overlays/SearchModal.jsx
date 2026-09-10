import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, TrendingUp, Sparkles, ArrowRight, User, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { searchCatalog, getTrendingSearches } from '../../services/searchService';

export default function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectArtisan,
  onNavigateToShop
}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], artisans: [], categories: [], totalMatches: 0 });
  const [trendingData, setTrendingData] = useState({ trending: [], tags: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const backdropRef = useRef(null);

  // Lock background scrolling and handle Escape dismiss
  useBodyScrollLock(isOpen, {
    containerRef,
    backdropRef,
    onClose
  });

  // Load trending suggestions on mount
  useEffect(() => {
    getTrendingSearches().then((data) => {
      setTrendingData(data);
    });
  }, []);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setResults({ products: [], artisans: [], categories: [], totalMatches: 0 });
    }
  }, [isOpen]);

  // Debounced search query effect
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], artisans: [], categories: [], totalMatches: 0 });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const searchResult = await searchCatalog(query);
        setResults(searchResult);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      handleViewAll();
    }
  };

  const handleBackdropClick = (e) => {
    if (backdropRef.current && e.target === backdropRef.current) {
      onClose();
    }
  };

  const handleTagClick = (tagLabel) => {
    setQuery(tagLabel);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleProductClick = (product) => {
    onClose();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleArtisanClick = (artisan) => {
    onClose();
    if (onSelectArtisan) {
      onSelectArtisan(artisan);
    }
  };

  const handleViewAll = () => {
    onClose();
    if (onNavigateToShop) {
      onNavigateToShop(query.trim());
    }
  };

  const isQueryActive = query.trim().length > 0;
  const hasProducts = results.products && results.products.length > 0;
  const hasArtisans = results.artisans && results.artisans.length > 0;
  const hasResults = hasProducts || hasArtisans;

  return (
    <div
      ref={backdropRef}
      className="search-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={t('search_placeholder', 'Search products and artisans')}
    >
      <div ref={containerRef} className="search-modal-container">
        {/* Header Search Bar */}
        <div className="search-modal-header">
          <div className="search-input-icon">
            {isLoading ? (
              <Loader2 size={20} className="search-spinner" />
            ) : (
              <Search size={20} />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder={t('search_placeholder', 'Search pottery, candles, woodcraft...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t('search_placeholder', 'Search')}
            autoComplete="off"
            spellCheck="false"
          />

          <div className="search-header-actions">
            {isQueryActive && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search input"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="button"
              className="search-close-btn"
              onClick={onClose}
              aria-label="Close search"
            >
              <span>ESC</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="search-modal-body">
          {/* Zero State: Trending Searches & Quick Category Tags */}
          {!isQueryActive && (
            <>
              {trendingData.trending && trendingData.trending.length > 0 && (
                <div className="search-section">
                  <div className="search-section-heading">
                    <span>
                      <TrendingUp size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      Trending Searches
                    </span>
                  </div>
                  <div className="search-chips-row">
                    {trendingData.trending.map((term) => (
                      <button
                        key={term}
                        type="button"
                        className="search-chip-btn"
                        onClick={() => handleTagClick(term)}
                      >
                        <Sparkles size={12} />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {trendingData.tags && trendingData.tags.length > 0 && (
                <div className="search-section">
                  <div className="search-section-heading">
                    <span>Popular Categories & Materials</span>
                  </div>
                  <div className="search-chips-row">
                    {trendingData.tags.map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        className="search-chip-btn"
                        onClick={() => handleTagClick(tag.label)}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Active Search Results */}
          {isQueryActive && (
            <>
              {/* Product Matches */}
              {hasProducts && (
                <div className="search-section">
                  <div className="search-section-heading">
                    <span>Matching Handcrafted Items</span>
                    <span className="search-match-count">
                      {results.totalMatches} item{results.totalMatches === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="search-products-list">
                    {results.products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        className="search-product-item"
                        onClick={() => handleProductClick(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="search-product-thumb"
                          loading="lazy"
                        />
                        <div className="search-product-details">
                          <div className="search-product-title-row">
                            <span className="search-product-name">{product.name}</span>
                            {product.category && (
                              <span className="search-product-category-tag">
                                {product.category}
                              </span>
                            )}
                          </div>
                          <div className="search-product-meta">
                            <span>by {product.artisan}</span>
                            {product.artisanCity && (
                              <>
                                <span className="search-product-meta-dot">•</span>
                                <span>{product.artisanCity}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="search-product-price">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Artisan Matches */}
              {hasArtisans && (
                <div className="search-section">
                  <div className="search-section-heading">
                    <span>
                      <User size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      Artisans & Makers
                    </span>
                  </div>
                  <div className="search-artisans-grid">
                    {results.artisans.map((artisan) => (
                      <button
                        key={artisan.id || artisan.name}
                        type="button"
                        className="search-artisan-card"
                        onClick={() => handleArtisanClick(artisan)}
                      >
                        {artisan.image && (
                          <img
                            src={artisan.image}
                            alt={artisan.name}
                            className="search-artisan-avatar"
                          />
                        )}
                        <div className="search-artisan-info">
                          <span className="search-artisan-name">{artisan.name}</span>
                          <span className="search-artisan-craft">
                            {artisan.craft || artisan.location}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !hasResults && (
                <div className="search-empty-state">
                  <div className="search-empty-icon">
                    <ShoppingBag size={22} />
                  </div>
                  <div className="search-empty-title">No items found for "{query}"</div>
                  <p className="search-empty-text">
                    Try searching for pottery, candles, jewelry, textiles, or an artisan's name.
                  </p>
                  <div className="search-chips-row" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                    {trendingData.trending && trendingData.trending.slice(0, 4).map((term) => (
                      <button
                        key={term}
                        type="button"
                        className="search-chip-btn"
                        onClick={() => handleTagClick(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="search-modal-footer">
          <div className="search-keyboard-hints">
            <span>
              <span className="search-key-badge">↵</span> to search
            </span>
            <span>
              <span className="search-key-badge">ESC</span> to exit
            </span>
          </div>

          {isQueryActive && hasResults && (
            <button
              type="button"
              className="search-view-all-btn"
              onClick={handleViewAll}
            >
              <span>View all {results.totalMatches} results in Shop</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
