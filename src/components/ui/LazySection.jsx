import React from 'react';
import useLazyVisibility from '../../hooks/useLazyVisibility';
import SectionSkeleton from './SectionSkeleton';

/**
 * LazySection
 * Progressively renders heavy below-the-fold content when the user approaches it.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The actual section/component to render
 * @param {React.ReactNode} [props.placeholder] - Custom placeholder element
 * @param {'grid'|'banner'|'carousel'|'text'} [props.skeletonVariant] - Skeleton variant if placeholder not provided
 * @param {string|number} [props.minHeight] - Minimum height to prevent layout shift (CLS)
 * @param {string} [props.rootMargin='250px 0px'] - Preload distance before entering viewport
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.animate=true] - Smooth fade-in entrance when visible
 */
export default function LazySection({
  children,
  placeholder,
  skeletonVariant = 'grid',
  minHeight,
  rootMargin = '250px 0px',
  className = '',
  animate = true
}) {
  const [ref, isVisible] = useLazyVisibility({
    rootMargin,
    freezeOnceVisible: true
  });

  const containerStyle = minHeight ? { minHeight } : undefined;

  return (
    <div
      ref={ref}
      className={`lazy-section-container ${className}`.trim()}
      style={containerStyle}
      aria-busy={!isVisible}
    >
      {isVisible ? (
        <div className={animate ? 'lazy-fade-enter' : ''}>
          {children}
        </div>
      ) : (
        placeholder || <SectionSkeleton variant={skeletonVariant} minHeight={minHeight} />
      )}
    </div>
  );
}
