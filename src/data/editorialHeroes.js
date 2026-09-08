/**
 * Editorial Promotional Hero Carousel Data
 * Standardized data structure prepared for future API / Database integrations.
 */

export const editorialHeroCards = [
  {
    id: 'editorial-1',
    tag: 'Artisan Heritage',
    tagKey: 'editorial_craft_heritage',
    title: 'The Soul of Traditional Stoneware',
    titleKey: 'editorial_title_1',
    sub: 'Hand-thrown on slow wooden wheels in Jaipur using mineral glazes and raw earth.',
    subKey: 'editorial_sub_1',
    cta: 'Explore Pottery',
    ctaKey: 'editorial_cta_1',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
    targetCategory: 'Pottery & Ceramics'
  },
  {
    id: 'editorial-2',
    tag: 'Pure & Hand-carved',
    tagKey: 'editorial_sustainable',
    title: 'Heirloom Reclaimed Woodcraft',
    titleKey: 'editorial_title_2',
    sub: 'Living grain sculpted with chisel and ancestral honor in Bengal studios.',
    cta: 'Explore Woodcraft',
    ctaKey: 'editorial_cta_2',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    targetCategory: 'Woodcraft'
  },
  {
    id: 'editorial-3',
    tag: 'Tribal Silversmithing',
    tagKey: 'editorial_sustainable_silver',
    title: 'Solid Recycled Sterling Silver',
    titleKey: 'editorial_title_3',
    sub: 'Botanical leaf impressions and hand-hammered metals reflecting organic light.',
    cta: 'Explore Jewelry',
    ctaKey: 'editorial_cta_3',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    targetCategory: 'Jewelry'
  },
  {
    id: 'editorial-4',
    tag: 'Sacred Pit Looms',
    tagKey: 'editorial_pure_weaves',
    title: 'Mulberry Silks & Plant Dyes',
    titleKey: 'editorial_title_4',
    sub: 'Weaving past, present, and spirit together on coastal and village looms.',
    cta: 'Explore Textiles',
    ctaKey: 'editorial_cta_4',
    image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?q=80&w=1200&auto=format&fit=crop',
    targetCategory: 'Textiles & Handloom'
  }
];

/**
 * Artisan Visual Showcase Cards (Moodboard / Visual Carousel)
 * Exactly matching the handcrafted artisan craft visual showcase from the screenshot:
 * 1. Earthenware pottery & terracotta vessels in studio
 * 2. Handcrafted wood & brass diya candle lamp with woven cane basket
 * 3. Stack of traditional Indian block-printed fabrics
 */
export const artisanShowcaseCards = [
  {
    id: 'showcase-pottery',
    title: 'Earthenware & Terracotta Studio',
    titleKey: 'showcase_pottery_title',
    alt: 'Handcrafted terracotta pottery vases and natural clay vessels in artisan studio',
    altKey: 'showcase_pottery_alt',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'showcase-candle',
    title: 'Turned Wood & Brass Candle Lamp',
    titleKey: 'showcase_candle_title',
    alt: 'Handcrafted wooden and brass diya candle stand with glowing flame and woven wicker basket',
    altKey: 'showcase_candle_alt',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'showcase-textiles',
    title: 'Heritage Hand Block-Printed Textiles',
    titleKey: 'showcase_textiles_title',
    alt: 'Stacked traditional hand block-printed Indian cotton textiles in indigo and terracotta',
    altKey: 'showcase_textiles_alt',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop'
  }
];

export default editorialHeroCards;

