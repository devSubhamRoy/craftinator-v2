import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const NavigationContext = createContext(null);

const sanitizePath = (path) => {
  if (!path) return '/';
  if (path === '/home') return '/';
  return path;
};

export function NavigationProvider({ children }) {
  /* Route state based on actual window URL */
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.startsWith('/product')) return sanitizePath(path + search);
    if (path.startsWith('/artisan') || path.startsWith('/maker')) return sanitizePath(path + search);
    if (path === '/shop') return '/shop';
    if (path === '/makers' || path === '/meet-makers') return '/makers';
    if (path.startsWith('/community')) return sanitizePath(path + search);
    if (path === '/profile') return '/profile';
    if (path === '/settings') return '/settings';
    return sanitizePath(path);
  });

  // Track if current navigation is a popstate (back/forward)
  const isPopStateNav = useRef(false);
  // Store target scroll metrics for pending restoration
  const pendingScrollRef = useRef(null);
  // In-memory scroll coordinates per path
  const scrollRegistryRef = useRef({});
  // In-memory UI view state cache (e.g., shop page filters, pagination)
  const pageStateRegistryRef = useRef({});
  // Flag to avoid scroll listener recording during programmatic restoration
  const isRestoringScroll = useRef(false);

  /* Force manual browser scroll restoration across all devices */
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  /* Normalized scroll position reader for Desktop, Mobile, and Tablet */
  const getNormalizedScrollY = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    return Math.max(
      window.scrollY || 0,
      window.pageYOffset || 0,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0
    );
  }, []);

  /* Save page UI state (e.g., filters, infinite scroll count) */
  const savePageState = useCallback((pageKey, state) => {
    if (!pageKey) return;
    pageStateRegistryRef.current[pageKey] = {
      ...(pageStateRegistryRef.current[pageKey] || {}),
      ...state
    };
    try {
      sessionStorage.setItem(
        `craft_state_${pageKey}`,
        JSON.stringify(pageStateRegistryRef.current[pageKey])
      );
    } catch (e) {}
  }, []);

  /* Retrieve saved page UI state */
  const getPageState = useCallback((pageKey) => {
    if (!pageKey) return null;
    if (pageStateRegistryRef.current[pageKey]) {
      return pageStateRegistryRef.current[pageKey];
    }
    try {
      const cached = sessionStorage.getItem(`craft_state_${pageKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        pageStateRegistryRef.current[pageKey] = parsed;
        return parsed;
      }
    } catch (e) {}
    return null;
  }, []);

  /* Passive scroll listener to continuously keep current route's scroll position up-to-date */
  useEffect(() => {
    const handleScroll = () => {
      if (isRestoringScroll.current || isPopStateNav.current) return;
      const scrollY = getNormalizedScrollY();
      scrollRegistryRef.current[currentPath] = {
        ...(scrollRegistryRef.current[currentPath] || {}),
        scrollY
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath, getNormalizedScrollY]);

  /* Popstate (Browser Back/Forward) Listener */
  useEffect(() => {
    const handlePopState = (event) => {
      const pathname = window.location.pathname;
      const search = window.location.search;
      let nextPath = '/';
      if (pathname.startsWith('/product')) {
        nextPath = pathname + search;
      } else if (pathname.startsWith('/artisan') || pathname.startsWith('/maker')) {
        nextPath = pathname + search;
      } else if (pathname === '/shop') {
        nextPath = '/shop';
      } else if (pathname === '/makers' || pathname === '/meet-makers') {
        nextPath = '/makers';
      } else if (pathname.startsWith('/community')) {
        nextPath = sanitizePath(pathname + search);
      } else if (pathname === '/profile') {
        nextPath = '/profile';
      } else if (pathname === '/settings') {
        nextPath = '/settings';
      } else {
        nextPath = sanitizePath(pathname);
      }

      // Mark this transition as Back / Forward navigation
      isPopStateNav.current = true;
      isRestoringScroll.current = true;

      // Extract saved target position and element anchor
      let targetY = 0;
      let targetId = null;

      if (event && event.state && typeof event.state.scrollY === 'number') {
        targetY = event.state.scrollY;
        targetId = event.state.targetId || null;
      } else if (scrollRegistryRef.current[nextPath]) {
        targetY = scrollRegistryRef.current[nextPath].scrollY || 0;
        targetId = scrollRegistryRef.current[nextPath].targetId || null;
      } else {
        try {
          const cached = sessionStorage.getItem(`craft_scroll_${nextPath}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            targetY = parsed.scrollY || 0;
            targetId = parsed.targetId || null;
          }
        } catch (e) {}
      }

      pendingScrollRef.current = { scrollY: targetY, targetId };
      setCurrentPath(nextPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /* Adaptive Multi-Frame Scroll Restoration / Reset Effect */
  useEffect(() => {
    if (isPopStateNav.current && pendingScrollRef.current) {
      // BACK / FORWARD NAVIGATION: Restore previous scroll position and section
      const { scrollY: targetY, targetId } = pendingScrollRef.current;
      isRestoringScroll.current = true;

      let passCount = 0;
      const maxPasses = 8; // Retry across several animation frames for layout stabilization
      let timeoutIds = [];

      const attemptRestore = () => {
        passCount += 1;

        // 1. If a specific card or section ID was anchored, prioritize bringing it into view
        if (targetId) {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ block: 'center', behavior: 'instant' });
            return;
          }
        }

        // 2. Perform normalized window scroll restoration
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });

        // 3. Verify if document height is sufficient or if layout is still expanding
        const currentDocHeight = document.documentElement.scrollHeight;
        const currentScroll = getNormalizedScrollY();

        // If target is beyond current doc height and we haven't reached max passes, schedule retry
        if (targetY > 0 && currentScroll < targetY - 10 && passCount < maxPasses) {
          const tId = setTimeout(attemptRestore, 40 * passCount);
          timeoutIds.push(tId);
        } else {
          // Layout stabilized
          isRestoringScroll.current = false;
          isPopStateNav.current = false;
          pendingScrollRef.current = null;
        }
      };

      // Start restoration on next render frame
      requestAnimationFrame(() => {
        attemptRestore();
        // Fallback cleanup timer to release scroll locks
        const finishTimer = setTimeout(() => {
          isRestoringScroll.current = false;
          isPopStateNav.current = false;
          pendingScrollRef.current = null;
        }, 450);
        timeoutIds.push(finishTimer);
      });

      return () => {
        timeoutIds.forEach(clearTimeout);
      };
    } else {
      // NEW PAGE NAVIGATION / REDIRECT: ALWAYS reset strictly to TOP (0, 0)
      isRestoringScroll.current = false;
      isPopStateNav.current = false;
      pendingScrollRef.current = null;

      // Execute immediate reset and frame-level safety zeroing
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    }
  }, [currentPath, getNormalizedScrollY]);

  /* Central Forward Navigation Method */
  const navigate = useCallback(
    (path, options = {}) => {
      const { targetId = null, replace = false, preserveScroll = false } = options;
      const nextPath = sanitizePath(path);
      const activeNormalized = sanitizePath(currentPath);

      // If navigating to the exact same path, scroll to top smoothly unless specified
      if (nextPath === activeNormalized) {
        if (!preserveScroll) {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
        return;
      }

      // 1. Record current page's scroll position and target element before leaving
      const currentScrollY = getNormalizedScrollY();
      const scrollData = { scrollY: currentScrollY, targetId };
      scrollRegistryRef.current[currentPath] = scrollData;

      try {
        sessionStorage.setItem(`craft_scroll_${currentPath}`, JSON.stringify(scrollData));
        window.history.replaceState(
          { path: currentPath, scrollY: currentScrollY, targetId },
          ''
        );
      } catch (e) {}

      // 2. Mark this navigation as forward (New Page -> ALWAYS TOP)
      isPopStateNav.current = false;
      isRestoringScroll.current = false;
      pendingScrollRef.current = null;

      // 3. Immediately reset scroll before route change for instantaneous response
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // 4. Update browser history
      if (typeof window !== 'undefined') {
        if (replace) {
          window.history.replaceState({ path: nextPath, scrollY: 0 }, '', nextPath);
        } else {
          window.history.pushState({ path: nextPath, scrollY: 0 }, '', nextPath);
        }
      }

      // 5. Update route state
      setCurrentPath(nextPath);
    },
    [currentPath, getNormalizedScrollY]
  );

  /* Central Back Navigation Method */
  const goBack = useCallback(
    (fallbackPath = '/') => {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
      } else {
        navigate(fallbackPath);
      }
    },
    [navigate]
  );

  const value = {
    currentPath,
    navigate,
    goBack,
    savePageState,
    getPageState,
    isPopStateNav: isPopStateNav.current
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
