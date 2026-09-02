import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function SellerCTA({ onStartSelling }) {
  const { t } = useLanguage();

  const steps = [
    { title: t('seller_title'), desc: t('bv_1_desc') },
    { title: t('seller_cta'), desc: t('bv_2_desc') },
    { title: t('community_title'), desc: t('bv_3_desc') },
    { title: t('hero_badge'), desc: t('bv_4_desc') }
  ];

  return (
    <section className="seller-section" id="seller-cta">
      <div className="container">
        
        <div className="seller-card">
          
          {/* Left Column: Terracotta Copy & CTAs */}
          <div className="seller-content">
            <span className="seller-eyebrow">Seller | Artisan</span>
            
            <h2 className="heading-lg seller-title">
              {t('seller_title')}
            </h2>

            <p className="seller-subtitle">
              {t('seller_subtitle')}
            </p>

            <div className="seller-actions">
              <button className="btn btn-white seller-btn-primary" onClick={onStartSelling}>
                {t('seller_cta')} <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Collage & Benefit Pills */}
          <div className="seller-visual">
            <div className="seller-steps-grid">
              {steps.map((step, idx) => (
                <div key={idx} className="seller-step-pill">
                  <CheckCircle2 size={18} className="step-check-icon" />
                  <div className="step-text">
                    <strong>{step.title}</strong>
                    <span>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
