import { useState, useEffect, useRef } from 'react';

/**
 * useLazyVisibility
 * Viewport-aware lazy trigger hook using native IntersectionObserver.
 * Triggers loading/rendering when element approaches the viewport.
 *
 * @param {Object} options
 * @param {string} [options.rootMargin='250px 0px'] - Preload margin to load before element enters screen
 * @param {number|number[]} [options.threshold=0.01] - Intersection ratio threshold
 * @param {boolean} [options.freezeOnceVisible=true] - Stop observing once element is visible
 * @param {boolean} [options.initialVisibility=false] - Initial visibility state
 * @returns {[React.RefObject, boolean]} - [containerRef, isVisible]
 */
export default function useLazyVisibility({
  rootMargin = '250px 0px',
  threshold = 0.01,
  freezeOnceVisible = true,
  initialVisibility = false
} = {}) {
  const [isVisible, setIsVisible] = useState(initialVisibility);
  const containerRef = useRef(null);

  useEffect(() => {
    // If already visible and freezeOnceVisible is true, nothing more to do
    if (freezeOnceVisible && isVisible) return;

    // Check IntersectionObserver support
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    let observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          if (freezeOnceVisible && observer) {
            observer.disconnect();
            observer = null;
          }
        } else if (!freezeOnceVisible) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [rootMargin, threshold, freezeOnceVisible, isVisible]);

  return [containerRef, isVisible];
}
