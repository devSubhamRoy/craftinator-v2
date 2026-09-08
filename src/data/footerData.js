/**
 * Footer Navigation Data Module for Craftinator-v2
 * Stores structured footer sections, categories, and quick links.
 * Supports internationalization (i18n) via translation keys with fallback defaults.
 */

export const footerSectionsData = [
  {
    key: 'shop',
    titleKey: 'footer_craft_categories',
    defaultTitle: 'Craft Categories',
    links: [
      { key: 'nav_explore', defaultText: 'Explore Marketplace' },
      { key: 'nav_trending', defaultText: 'Trending Products' },
      { key: 'nav_categories', defaultText: 'All Categories' }
    ]
  },
  {
    key: 'discover',
    titleKey: 'footer_quick_links',
    defaultTitle: 'Quick Links',
    links: [
      { key: 'nav_makers', defaultText: 'Meet Master Artisans' },
      { key: 'nav_community', defaultText: 'Community Stories' },
      { key: 'nav_story', defaultText: 'Artisan Process' }
    ]
  },
  {
    key: 'sell',
    titleKey: 'footer_brand_title',
    defaultTitle: 'CRAFTINATOR',
    links: [
      { key: 'seller_cta', defaultText: 'Sell Handcrafted Goods' },
      { key: 'bv_1_title', defaultText: '100% Authentic Handcrafted' },
      { key: 'bv_2_title', defaultText: 'Direct Studio Support' }
    ]
  },
  {
    key: 'help',
    titleKey: 'footer_customer_care',
    defaultTitle: 'Customer Care',
    links: [
      { key: 'footer_customer_care', defaultText: 'Help Center & Support' },
      { key: 'bv_3_title', defaultText: 'Sustainable Eco Packaging' },
      { key: 'bv_4_title', defaultText: '14-Day Artisan Return Guarantee' }
    ]
  }
];

/**
 * Resolves localized footer sections using the active i18n translation function `t`.
 * @param {Function} t - i18n translation helper `t(key, defaultText)`
 * @returns {Array} Array of localized section objects formatted for Footer component rendering
 */
export function getFooterSections(t) {
  if (typeof t !== 'function') {
    return footerSectionsData.map((sec) => ({
      key: sec.key,
      title: sec.defaultTitle,
      links: sec.links.map((link) => link.defaultText)
    }));
  }

  return footerSectionsData.map((sec) => ({
    key: sec.key,
    title: t(sec.titleKey, sec.defaultTitle),
    links: sec.links.map((link) => t(link.key, link.defaultText))
  }));
}
