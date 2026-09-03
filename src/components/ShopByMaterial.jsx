import React from 'react';
import { materials } from '../data/materials';

export default function ShopByMaterial({ onSelectMaterial }) {
  return (
    <section className="material-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow">Shop by Material</span>
          <h2 className="heading-lg section-title">Crafted From Something Real.</h2>
        </div>

        {/* Material Cards Track */}
        <div className="material-track-wrapper">
          <div className="material-grid">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="material-card"
                onClick={() => onSelectMaterial && onSelectMaterial(mat.name)}
              >
                <img
                  src={mat.image}
                  alt={mat.name}
                  className="material-card-img img-cover"
                  loading="lazy"
                />
                <div className="material-card-overlay" />
                <span className="material-card-name">{mat.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
