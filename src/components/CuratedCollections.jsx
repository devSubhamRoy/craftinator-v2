import React from 'react';
import { curatedCollections } from '../data/shopCollections';
import { ArrowRight } from 'lucide-react';

export default function CuratedCollections({ onSelectCollection }) {
  return (
    <section className="curated-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <h2 className="heading-lg section-title">Curated for You</h2>
          <p className="paragraph-lg section-subtitle">
            Thoughtfully selected pieces from makers worth discovering.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="curated-grid">
          {curatedCollections.map((col) => (
            <div
              key={col.id}
              className="curated-card"
              onClick={() => onSelectCollection && onSelectCollection(col.categoryFilter)}
            >
              <div className="curated-card-media">
                <img
                  src={col.image}
                  alt={col.title}
                  className="curated-card-img img-cover"
                  loading="lazy"
                />
                <div className="curated-card-overlay" />
                <div className="curated-card-content">
                  <span className="curated-card-label">{col.label}</span>
                  <h3 className="curated-card-title">{col.title}</h3>
                  <p className="curated-card-desc">{col.description}</p>
                  <button className="curated-card-btn">
                    <span>Explore Collection</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
