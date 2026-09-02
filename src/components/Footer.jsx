import React, { useState } from 'react';
import { ChevronDown, Instagram, Facebook, Youtube, Share2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  const footerSections = [
    {
      key: 'shop',
      title: t('footer_craft_categories'),
      links: [t('nav_explore'), t('nav_trending'), t('nav_categories')]
    },
    {
      key: 'discover',
      title: t('footer_quick_links'),
      links: [t('nav_makers'), t('nav_community'), t('nav_story')]
    },
    {
      key: 'sell',
      title: 'CRAFTINATOR',
      links: [t('seller_cta'), t('bv_1_title'), t('bv_2_title')]
    },
    {
      key: 'help',
      title: t('footer_customer_care'),
      links: [t('footer_customer_care'), t('bv_3_title'), t('bv_4_title')]
    }
  ];

  return (
    <footer className="footer-root">
      <div className="container">
        
        {/* Main Footer Layout */}
        <div className="footer-top">
          
          {/* Left Brand Column */}
          <div className="footer-brand-col">
            <a href="#" className="brand-logo-text">
              Craftinator
            </a>
            <p className="footer-slogan">Artisans. Community. Connections.</p>
            <p className="footer-brand-desc">
              {t('footer_about')}
            </p>
          </div>

          {/* Right Link Columns (Desktop Grid & Mobile Accordions) */}
          <div className="footer-nav-grid">
            {footerSections.map((sec) => {
              const isOpen = openSection === sec.key;
              return (
                <div key={sec.key} className="footer-column">
                  
                  {/* Column Header */}
                  <div
                    className="footer-col-header"
                    onClick={() => toggleSection(sec.key)}
                  >
                    <h4 className="footer-col-title">{sec.title}</h4>
                    <ChevronDown
                      size={16}
                      className={`footer-accordion-icon ${isOpen ? 'open' : ''}`}
                    />
                  </div>

                  {/* Links List */}
                  <ul className={`footer-links-list ${isOpen ? 'show-mobile' : ''}`}>
                    {sec.links.map((link, idx) => (
                      <li key={idx}>
                        <a href="#trending-products" className="footer-link">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>

                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 Craftinator. {t('footer_rights')}
          </div>

          <div className="footer-social-icons">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon-btn">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-icon-btn">
              <Facebook size={18} />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest" className="social-icon-btn">
              <Share2 size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-icon-btn">
              <Youtube size={18} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
