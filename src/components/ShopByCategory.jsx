import React from 'react';
import { categories } from '../data/categories';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ShopByCategory({ onSelectCategory }) {
  const { t } = useLanguage();

  return (
    <section className="category-section" id="shop-by-category">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow">{t('nav_categories')}</span>
          <h2 className="heading-lg section-title">{t('cat_title')}</h2>
          <p className="paragraph-lg section-subtitle">
            {t('cat_subtitle')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-card ${cat.gridClass}`}
              onClick={() => onSelectCategory && onSelectCategory(cat)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="category-card-bg img-cover"
                loading="lazy"
              />
              <div className="category-card-overlay" />

              <div className="category-card-content">
                <div className="category-info">
                  <span className="category-count">{cat.itemCount}</span>
                  <h3 className="category-title">{cat.name}</h3>
                </div>
                <button className="category-explore-btn" aria-label={`Explore ${cat.name}`}>
                  <span>{t('nav_explore')}</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
