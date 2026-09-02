import React, { useState } from 'react';
import { Award, Sparkles, HeartHandshake, Leaf } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function BrandValues() {
  const { t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  const values = [
    {
      icon: Award,
      title: t('bv_1_title'),
      desc: t('bv_1_desc')
    },
    {
      icon: Sparkles,
      title: t('bv_2_title'),
      desc: t('bv_2_desc')
    },
    {
      icon: HeartHandshake,
      title: t('bv_3_title'),
      desc: t('bv_3_desc')
    },
    {
      icon: Leaf,
      title: t('bv_4_title'),
      desc: t('bv_4_desc')
    }
  ];

  // 4x duplicated items for 100% seamless infinite loop without blank gaps
  const marqueeValues = [...values, ...values, ...values, ...values];

  return (
    <section className="brand-values-section">
      <div className="container brand-values-container">
        
        {/* Desktop Static 4-Column Grid (>= 1024px) */}
        <div className="brand-values-desktop-grid">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="value-card">
                <div className="value-icon-wrapper">
                  <Icon size={18} className="value-icon" />
                </div>
                <div className="value-content">
                  <h3 className="value-title">{item.title}</h3>
                  <p className="value-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet Auto-Moving Horizontal Row Marquee (< 1024px) */}
        <div
          className="brand-values-marquee-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onTouchCancel={() => setIsPaused(false)}
        >
          <div className={`brand-values-marquee-track ${isPaused ? 'is-paused' : ''}`}>
            {marqueeValues.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="value-card marquee-card">
                  <div className="value-icon-wrapper">
                    <Icon size={18} className="value-icon" />
                  </div>
                  <div className="value-content">
                    <h3 className="value-title">{item.title}</h3>
                    <p className="value-desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
