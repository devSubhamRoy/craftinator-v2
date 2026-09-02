import React from 'react';
import { Award, Sparkles, HeartHandshake, Leaf, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function BrandValues() {
  const { t } = useLanguage();

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

  return (
    <section className="brand-values-section">
      <div className="container">
        <div className="brand-values-grid">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="value-card">
                <div className="value-icon-wrapper">
                  <Icon size={20} className="value-icon" />
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
    </section>
  );
}
