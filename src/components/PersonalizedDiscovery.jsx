import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function PersonalizedDiscovery({ onFilterByStyle }) {
  const { t } = useLanguage();
  const [selectedStyles, setSelectedStyles] = useState(['Minimalist Earthy', 'Boho Chic']);

  const styleChips = [
    t('style_minimalist'),
    t('style_boho'),
    t('style_rustic'),
    t('style_vintage')
  ];

  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  return (
    <section className="discovery-section" id="personalized-discovery">
      <div className="container discovery-container">
        
        {/* Left Column: Heading & Interactive Interest Chips */}
        <div className="discovery-left">
          <span className="eyebrow">{t('discovery_title')}</span>
          <h2 className="heading-lg discovery-title">{t('discovery_subtitle')}</h2>
          
          <div className="discovery-chips-wrapper">
            {styleChips.map((chip) => {
              const isSelected = selectedStyles.includes(chip);
              return (
                <button
                  key={chip}
                  className={`discovery-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleStyle(chip)}
                >
                  {isSelected && <Check size={14} className="chip-check" />}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Prompt & CTA Button */}
        <div className="discovery-right">
          <div className="discovery-prompt-card">
            <Sparkles size={28} className="prompt-icon" />
            <p className="paragraph-lg prompt-text">
              {t('discovery_subtitle')}
            </p>
            <button
              className="btn btn-primary discovery-cta-btn"
              onClick={() => onFilterByStyle && onFilterByStyle(selectedStyles[0] || 'Minimal')}
            >
              {t('nav_explore')} <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
