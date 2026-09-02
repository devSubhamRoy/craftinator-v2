import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Newsletter({ onSubscribe }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    if (onSubscribe) onSubscribe(email);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        
        <div className="newsletter-card">
          <div className="section-header text-center newsletter-header">
            <span className="eyebrow">{t('newsletter_title')}</span>
            <h2 className="heading-lg section-title">{t('newsletter_title')}</h2>
            <p className="paragraph-lg section-subtitle">
              {t('newsletter_subtitle')}
            </p>
          </div>

          {submitted ? (
            <div className="newsletter-success animate-fade-in">
              <CheckCircle size={32} className="success-icon" />
              <h3>{t('toast_subscribed')}</h3>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder={t('newsletter_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                  aria-label="Your email address"
                />
              </div>
              <button type="submit" className="btn btn-primary newsletter-btn">
                {t('newsletter_button')} <ArrowRight size={18} />
              </button>
            </form>
          )}

          <p className="newsletter-microtext">
            No spam. Just beautiful things made by real people.
          </p>

        </div>

      </div>
    </section>
  );
}
