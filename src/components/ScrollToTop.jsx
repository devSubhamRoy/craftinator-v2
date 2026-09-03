import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import '../styles/ScrollToTop.css';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  const scrollStopTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Screen is actively moving -> HIDE the button immediately!
      setIsVisible(false);
      setIsFading(false);

      // Clear any pending show/fade/hide timers while moving
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

      const currentScrollY = window.scrollY;

      // Don't show if user is near the top of the page (< 180px)
      if (currentScrollY <= 180) {
        return;
      }

      // 2. Detect when screen STOPS moving (debounce ~120ms)
      scrollStopTimerRef.current = setTimeout(() => {
        // Screen is NOT moving!
        if (window.scrollY > 180 && !isHoveredRef.current) {
          setIsVisible(true);
          setIsFading(false);

          // After 3 seconds of screen not moving, begin smooth fade-out
          fadeTimerRef.current = setTimeout(() => {
            if (!isHoveredRef.current) {
              setIsFading(true);
            }
          }, 3000);

          // By 5 seconds (3s + 2s CSS smooth fade), completely hide
          hideTimerRef.current = setTimeout(() => {
            if (!isHoveredRef.current) {
              setIsVisible(false);
              setIsFading(false);
            }
          }, 5000);
        }
      }, 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setIsFading(false);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    // Resume fade-out after user moves cursor away
    fadeTimerRef.current = setTimeout(() => {
      setIsFading(true);
    }, 2000);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsFading(false);
    }, 3900);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsVisible(false);
    setIsFading(false);
    if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  return (
    <button
      type="button"
      className={`scroll-to-top-btn ${isFading ? 'fading' : isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Scroll to top of page"
      title="Scroll to top"
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
}
