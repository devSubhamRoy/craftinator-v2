import React from 'react';
import { testimonials } from '../data/testimonials';
import { Star } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow">{t('testimonials_title')}</span>
          <h2 className="heading-lg section-title">{t('testimonials_title')}</h2>
          <p className="paragraph-lg section-subtitle">
            {t('testimonials_subtitle')}
          </p>
        </div>

        {/* Testimonials Grid / Carousel */}
        <div className="testimonials-grid">
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              
              {/* Star Rating */}
              <div className="testimonial-stars">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#A85838" color="#A85838" />
                ))}
              </div>

              {/* Quote text */}
              <p className="testimonial-quote">"{item.quote}"</p>

              {/* Author Footer */}
              <div className="testimonial-author">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="author-avatar"
                />
                <div className="author-details">
                  <strong className="author-name">{item.author}</strong>
                  <span className="author-meta">{item.city} • Verified Buyer</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
