import React from "react";
import {
  ArrowRight,
  Share2,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  MessageSquareHeart,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import "../styles/SellerCTA.css";

export default function SellerCTA({ onStartSelling }) {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: <Share2 size={20} />,
      title: "Social Maker Feeds & Storytelling",
      desc: "Post studio clips, behind-the-wheel process updates, and craft lore. Mindful collectors fall in love with your hands, not just a product code.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "100% Handmade & Anti-Dropshipping",
      desc: "Zero factory mass-production or generic reselling. Our curated verification guarantees authentic creators get the elevated spotlight they deserve.",
    },
    {
      icon: <MessageSquareHeart size={20} />,
      title: "Direct Collector Conversations & Custom Orders",
      desc: "Chat 1-on-1 with patrons for bespoke sizes, personalized inscriptions, and heirloom commissions with seamless buyer-seller protection.",
    },
    {
      icon: <Sparkles size={20} />,
      title: "Fair Maker Economics & Transparent Growth",
      desc: "Maker-first pricing structure with zero predatory algorithmic fees. You set your true worth and keep the lion’s share of every sale.",
    },
  ];

  return (
    <section className="seller-section" id="seller-cta">
      <div className="container">
        <div className="seller-card">
          {/* Left Column: Why Craftinator is Best For You */}
          <div className="seller-content">
            <span className="seller-eyebrow">
              <Sparkles size={14} />
              Why Craftinator • The Maker’s Advantage
            </span>

            <h2 className="heading-lg seller-title">
              Where Authentic Craft Meets a Thriving Social Community.
            </h2>

            <p className="seller-subtitle">
              Craftinator isn't just another faceless storefront. We bridge
              independent artisans and discerning collectors through rich social
              studio feeds, authentic maker storytelling, and fair craft
              commerce.
            </p>

            <div className="seller-actions">
              <button
                type="button"
                className="seller-btn-primary"
                onClick={onStartSelling}
              >
                <span>Open Your Maker Studio</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="seller-btn-secondary"
                onClick={() => {
                  const el = document.getElementById("meet-makers");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>Meet Active Artisans</span>
              </button>
            </div>

            {/* Platform Credibility & Trust Metrics */}
            <div className="seller-stats-strip">
              <div className="seller-stat-item">
                <span className="seller-stat-number">10K+</span>
                <span className="seller-stat-label">Mindful Collectors</span>
              </div>
              <div className="seller-stat-item">
                <span className="seller-stat-number">100%</span>
                <span className="seller-stat-label">Verified Handmade</span>
              </div>
              <div className="seller-stat-item">
                <span className="seller-stat-number">0%</span>
                <span className="seller-stat-label">Factory Dropship</span>
              </div>
              <div className="seller-stat-item">
                <span className="seller-stat-number">4.9★</span>
                <span className="seller-stat-label">Maker Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Core Why Us Value Pillars */}
          <div className="seller-visual">
            <div className="seller-steps-grid">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="seller-step-pill">
                  <div className="step-icon-box">{benefit.icon}</div>
                  <div className="step-text">
                    <strong>{benefit.title}</strong>
                    <span>{benefit.desc}</span>
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
