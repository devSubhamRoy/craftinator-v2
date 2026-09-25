import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

/**
 * High-Fidelity Cart Skeleton Loading Placeholder
 * Replicates the exact layout grid, shipping meter, items list, and sticky summary card
 */
export default function CartSkeleton() {
  return (
    <div className="cart-skeleton-container" aria-busy="true" aria-label="Loading shopping cart">
      {/* 1. Breadcrumbs Skeleton */}
      <div className="cart-skel-breadcrumb">
        <div className="skel-block" style={{ width: '150px', height: '16px' }} />
      </div>

      {/* 2. Header Skeleton */}
      <div className="cart-skel-header">
        <div className="skel-block" style={{ width: '220px', height: '36px', borderRadius: '8px' }} />
        <div className="skel-block" style={{ width: '80px', height: '26px', borderRadius: '20px' }} />
      </div>

      {/* 3. Shipping Meter Skeleton */}
      <div className="cart-skel-shipping-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div className="skel-block" style={{ width: '280px', height: '18px' }} />
          <div className="skel-block" style={{ width: '60px', height: '18px' }} />
        </div>
        <div className="skel-block" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
      </div>

      {/* 4. Main 2-Column Grid */}
      <div className="cart-layout-grid">
        {/* Left Column: Cart Items Skeleton */}
        <div className="cart-main-column">
          <div className="cart-items-wrapper">
            {/* Table Header Placeholder */}
            <div className="cart-skel-table-header">
              <div className="skel-block" style={{ width: '120px', height: '16px' }} />
              <div className="skel-block" style={{ width: '80px', height: '16px' }} />
              <div className="skel-block" style={{ width: '60px', height: '16px' }} />
            </div>

            {/* Skeleton Cart Item Rows */}
            {[1, 2, 3].map((idx) => (
              <div key={`skel-item-${idx}`} className="cart-skel-item-row">
                <div className="skel-block cart-skel-thumb" />
                <div className="cart-skel-item-info">
                  <div className="skel-block" style={{ width: '80px', height: '16px', marginBottom: '0.5rem', borderRadius: '4px' }} />
                  <div className="skel-block" style={{ width: '65%', height: '20px', marginBottom: '0.5rem' }} />
                  <div className="skel-block" style={{ width: '45%', height: '14px', marginBottom: '0.75rem' }} />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="skel-block" style={{ width: '90px', height: '16px' }} />
                    <div className="skel-block" style={{ width: '70px', height: '16px' }} />
                  </div>
                </div>
                <div className="cart-skel-item-actions">
                  <div className="skel-block" style={{ width: '96px', height: '36px', borderRadius: '6px' }} />
                  <div className="skel-block" style={{ width: '80px', height: '22px', marginTop: '0.5rem' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Upsell Skeleton */}
          <div className="cart-upsell-section" style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div className="skel-block" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              <div className="skel-block" style={{ width: '220px', height: '24px', borderRadius: '6px' }} />
            </div>
            <div className="product-grid shop-product-grid">
              <ProductCardSkeleton count={4} />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Skeleton */}
        <aside className="cart-sidebar-column">
          <div className="cart-skel-summary-card">
            <div className="skel-block" style={{ width: '160px', height: '24px', marginBottom: '1.25rem' }} />
            <div className="skel-block" style={{ width: '100%', height: '44px', marginBottom: '1.5rem', borderRadius: '8px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="skel-block" style={{ width: '90px', height: '16px' }} />
                <div className="skel-block" style={{ width: '70px', height: '16px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="skel-block" style={{ width: '80px', height: '16px' }} />
                <div className="skel-block" style={{ width: '60px', height: '16px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="skel-block" style={{ width: '110px', height: '16px' }} />
                <div className="skel-block" style={{ width: '75px', height: '16px' }} />
              </div>
            </div>
            <div className="skel-block" style={{ width: '100%', height: '1px', marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div className="skel-block" style={{ width: '70px', height: '22px' }} />
              <div className="skel-block" style={{ width: '100px', height: '26px' }} />
            </div>
            <div className="skel-block" style={{ width: '100%', height: '52px', borderRadius: '8px', marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <div className="skel-block" style={{ width: '80px', height: '14px' }} />
              <div className="skel-block" style={{ width: '80px', height: '14px' }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
