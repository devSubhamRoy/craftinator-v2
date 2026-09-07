import React, { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

/**
 * Artisan Loading Screen & App Preloader
 * Features:
 * - Shimmering terracotta progress track
 * - Dynamic rotating artisan craft captions
 * - Smooth cubic-bezier exit fade-out
 * - Internationalization support
 */
export default function LoadingScreen({ onComplete, minDuration = 800 }) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Lock background scrolling during preloader
  useBodyScrollLock(true);

  // Dynamic artisan micro-messages
  const steps = [
    t("loading_step_1", "Discovering treasures shaped by human hands..."),
    t(
      "loading_step_2",
      "Connecting you with independent artisans and makers..."
    ),
    t(
      "loading_step_3",
      "Bringing makers, stories, and community closer together..."
    )
  ];

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 20;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Calculate smooth easing progress
      const rawProgress = Math.min(
        100,
        Math.round((elapsed / minDuration) * 100)
      );

      setProgress(rawProgress);

      // Rotate steps based on progress
      if (rawProgress > 65) {
        setStepIndex(2);
      } else if (rawProgress > 30) {
        setStepIndex(1);
      } else {
        setStepIndex(0);
      }

      if (rawProgress >= 100) {
        clearInterval(timer);
        // Brief pause at 100% for visual polish, then trigger smooth fade-out
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500); // matches CSS fade duration
        }, 120);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minDuration, onComplete]);

  return (
    <div
      className={`loading-screen-overlay ${isFadingOut ? "fade-out" : ""}`}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
      aria-label="Loading Craftinator Artisan Marketplace"
    >
      {/* Background Decorative Ambient Rings */}
      <div
        className="loading-ambient-ring loading-ambient-ring-1"
        aria-hidden="true"
      />
      <div
        className="loading-ambient-ring loading-ambient-ring-2"
        aria-hidden="true"
      />

      {/* Main Center Card */}
      <div className="loading-content-card">
        {/* Brand Header */}
        <h1 className="loading-brand-title">
          {t("loading_brand", "Craftinator")}
        </h1>

        <p className="loading-brand-tagline">
          {t("loading_tagline", "Artisans. Community. Connection.")}
        </p>

        {/* Progress Bar Track */}
        <div className="loading-progress-container" aria-hidden="true">
          <div
            className="loading-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Step Caption (Numerical percentage hidden as requested) */}
        <p className="loading-step-caption" aria-live="polite">
          {steps[stepIndex]}
        </p>
      </div>
    </div>
  );
}
