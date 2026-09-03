import { useEffect, useRef } from 'react';

let lockCount = 0;
let savedScrollY = 0;
let savedScrollX = 0;
let savedStyles = null;

/**
 * Custom hook to lock body scrolling when a sidebar/drawer/modal is open.
 * - Freezes background in place without jumping to top
 * - Restores exact scroll coordinates when closed
 * - Prevents scrollbar layout shifting via padding compensation
 * - Blocks touchmove/swipe outside the container (crucial for iOS Safari)
 * - Intercepts background-scrolling keyboard events (Space, PageUp/Down, Arrows)
 * - Allows full scrolling and interaction inside the sidebar container
 *
 * @param {boolean} isLocked Whether the sidebar/drawer is currently open
 * @param {Object} options Options for fine-grained control
 * @param {React.RefObject} options.containerRef Ref to the sidebar/drawer panel element
 * @param {React.RefObject} options.backdropRef Ref to the backdrop overlay element
 * @param {Function} options.onClose Optional callback to invoke when Escape is pressed
 */
export function useBodyScrollLock(isLocked, options = {}) {
  const { containerRef, backdropRef, onClose } = options;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isLocked) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      savedScrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      savedStyles = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        width: document.body.style.width,
        overflow: document.body.style.overflow,
        paddingRight: document.body.style.paddingRight,
      };

      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = `-${savedScrollX}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    lockCount += 1;

    // Prevent background touch scrolling on mobile (e.g. on backdrop or outer edges)
    const handleTouchMove = (e) => {
      if (containerRef?.current) {
        if (!containerRef.current.contains(e.target)) {
          e.preventDefault();
        }
      } else if (backdropRef?.current) {
        if (e.target === backdropRef.current) {
          e.preventDefault();
        }
      }
    };

    // Prevent keyboard scroll navigation from affecting background
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onCloseRef.current) {
          e.preventDefault();
          onCloseRef.current();
        }
        return;
      }

      const scrollKeys = [' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'];
      if (scrollKeys.includes(e.key)) {
        const active = document.activeElement;
        const isInput = active && (
          active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          active.tagName === 'SELECT' ||
          active.isContentEditable
        );

        // If not in a text field, check if target is inside the active sidebar
        if (!isInput) {
          if (!containerRef?.current || !containerRef.current.contains(active || e.target)) {
            e.preventDefault();
          }
        }
      }
    };

    // Attach non-passive touchmove to document so e.preventDefault() works on iOS
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);

      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0 && savedStyles) {
        document.body.style.position = savedStyles.position;
        document.body.style.top = savedStyles.top;
        document.body.style.left = savedStyles.left;
        document.body.style.width = savedStyles.width;
        document.body.style.overflow = savedStyles.overflow;
        document.body.style.paddingRight = savedStyles.paddingRight;

        window.scrollTo(savedScrollX, savedScrollY);
        savedStyles = null;
      }
    };
  }, [isLocked, containerRef, backdropRef]);
}
