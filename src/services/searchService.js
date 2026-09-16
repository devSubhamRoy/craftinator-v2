/**
 * Search Service Layer
 * 
 * Provides an async, decoupled interface for catalog search, suggestions, and trending queries.
 * Currently searches the local product and artisan datasets.
 * 
 * FUTURE BACKEND API INTEGRATION:
 * When your backend search API is ready, simply replace the local filtering logic in `searchCatalog`
 * with your endpoint call (e.g., `const res = await fetch('/api/v1/search?q=' + encodeURIComponent(query))`).
 * The UI components depend ONLY on this service contract, so no UI changes will be needed.
 */

import { products } from '../data/products';
import { artisans } from '../data/artisans';

/**
 * Trending / Suggested search terms when query is empty
 */
const TRENDING_SEARCHES = [
  'Ceramic Vase',
  'Scented Candle',
  'Sterling Silver',
  'Jaipur Terracotta',
  'Handwoven Shawl',
  'Walnut Wood'
];

/**
 * Popular searchable categories and materials for quick-tag filters
 */
const POPULAR_TAGS = [
  { label: 'Pottery & Ceramics', type: 'category' },
  { label: 'Jewelry', type: 'category' },
  { label: 'Home Decor', type: 'category' },
  { label: 'Textiles', type: 'category' },
  { label: 'Woodcraft', type: 'category' },
  { label: 'Jaipur Clay', type: 'material' },
  { label: 'Sterling Silver', type: 'material' },
  { label: 'Pure Soy Wax', type: 'material' }
];

/**
 * Perform an asynchronous search across catalog items.
 * 
 * @param {string} query - User search term
 * @param {Object} options - Search configuration options
 * @param {number} options.limit - Max products to return (default: 8)
 * @param {string} [options.category] - Optional category filter
 * @returns {Promise<{ products: Array, artisans: Array, categories: Array, totalMatches: number }>}
 */
export async function searchCatalog(query = '', options = {}) {
  const { limit = 8, category = null } = options;
  const trimmed = query.trim().toLowerCase();

  // Small delay for smooth UX transition
  await new Promise((resolve) => setTimeout(resolve, 60));

  // If query is empty, return empty result
  if (!trimmed) {
    return {
      products: [],
      artisans: [],
      categories: [],
      totalMatches: 0
    };
  }

  // Split query terms for multi-word matching (e.g. "ceramic vase")
  const searchTerms = trimmed.split(/\s+/).filter(Boolean);

  // 1. Filter Products
  const matchingProducts = products.filter((product) => {
    if (category && category !== 'All' && product.category !== category) {
      return false;
    }

    const name = (product.name || '').toLowerCase();
    const artisan = (product.artisan || '').toLowerCase();
    const city = (product.artisanCity || '').toLowerCase();
    const cat = (product.category || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const materials = Array.isArray(product.materials) 
      ? product.materials.join(' ').toLowerCase() 
      : '';
    const style = (product.styleTag || '').toLowerCase();

    const searchableText = `${name} ${artisan} ${city} ${cat} ${desc} ${materials} ${style}`;

    // Product must match all terms in the query
    return searchTerms.every((term) => searchableText.includes(term));
  });

  // Sort: Exact name matches first, then trending/bestseller, then rating
  matchingProducts.sort((a, b) => {
    const aNameMatch = a.name.toLowerCase().startsWith(trimmed) ? 2 : 0;
    const bNameMatch = b.name.toLowerCase().startsWith(trimmed) ? 2 : 0;
    if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;

    const aTrending = a.isTrending ? 1 : 0;
    const bTrending = b.isTrending ? 1 : 0;
    if (aTrending !== bTrending) return bTrending - aTrending;

    return (b.rating || 0) - (a.rating || 0);
  });

  // 2. Filter Matching Artisans
  const matchingArtisans = (artisans || []).filter((artisan) => {
    const name = (artisan.name || '').toLowerCase();
    const craft = (artisan.craft || '').toLowerCase();
    const location = (artisan.location || '').toLowerCase();
    const searchableText = `${name} ${craft} ${location}`;
    return searchTerms.some((term) => searchableText.includes(term));
  });

  // 3. Extract matching categories
  const matchingCategories = POPULAR_TAGS.filter((tag) =>
    tag.label.toLowerCase().includes(trimmed)
  );

  return {
    products: matchingProducts.slice(0, limit),
    artisans: matchingArtisans.slice(0, 3),
    categories: matchingCategories,
    totalMatches: matchingProducts.length
  };
}

/**
 * Fetch trending searches and quick tags for zero-state suggestions
 * 
 * @returns {Promise<{ trending: string[], tags: Array }>}
 */
export async function getTrendingSearches() {
  return {
    trending: TRENDING_SEARCHES,
    tags: POPULAR_TAGS
  };
}
