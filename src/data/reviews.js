/**
 * Product Reviews Data Model
 * Organized by productId (Foreign Key mapping) for seamless Database and API integration.
 */

export const productReviews = {
  'nordicness-ceramic-vase': [
    {
      id: 'rev-ncv-1',
      productId: 'nordicness-ceramic-vase',
      author: 'Aarav Patel',
      rating: 5,
      date: '2 weeks ago',
      content:
        'The texture and craftsmanship are exceptional. You can genuinely feel the time and care that went into every contour. Arrived in beautiful eco-friendly packaging.'
    },
    {
      id: 'rev-ncv-2',
      productId: 'nordicness-ceramic-vase',
      author: 'Meera Sen',
      rating: 5,
      date: '1 month ago',
      content:
        'Even more stunning in person than on the site! It has become the centerpiece of my dining space. Maya Sharma is truly a master artisan.'
    },
    {
      id: 'rev-ncv-3',
      productId: 'nordicness-ceramic-vase',
      author: 'Vikram Joshi',
      rating: 5,
      date: '1 month ago',
      content:
        'Authentic handcrafted masterpiece. The earthy tones and natural glazes make it truly one of a kind. Fast and safe dispatch directly from the Jaipur studio.'
    }
  ],

  'base-botanical-earrings': [
    {
      id: 'rev-bbe-1',
      productId: 'base-botanical-earrings',
      author: 'Pooja Deshmukh',
      rating: 5,
      date: '3 days ago',
      content:
        'Subtle, elegant, and surprisingly lightweight. The hand-hammered botanical relief catches the morning light with unmatched organic grace.'
    },
    {
      id: 'rev-bbe-2',
      productId: 'base-botanical-earrings',
      author: 'Rhea Kapoor',
      rating: 5,
      date: '2 weeks ago',
      content:
        'Solid 925 silver with a wonderful tactile presence. Knowing this was handcrafted in Delhi by Asha Mehta makes wearing them deeply special.'
    },
    {
      id: 'rev-bbe-3',
      productId: 'base-botanical-earrings',
      author: 'Ananya Roy',
      rating: 4,
      date: '1 month ago',
      content:
        'Exquisite silver work and hypoallergenic posts that feel comfortable all day. Beautiful cloth pouch packaging.'
    }
  ],

  'monet-ceramic-alister-bowl': [
    {
      id: 'rev-mcb-1',
      productId: 'monet-ceramic-alister-bowl',
      author: 'Kunal Singhania',
      rating: 5,
      date: '1 week ago',
      content:
        'The speckled glaze and tactile rim are extraordinary. Holds fruit or centerpiece arrangements with such quiet sophistication.'
    },
    {
      id: 'rev-mcb-2',
      productId: 'monet-ceramic-alister-bowl',
      author: 'Divya Nambiar',
      rating: 5,
      date: '3 weeks ago',
      content:
        'Twice-fired stoneware that feels sturdy yet full of poetic character. Delivered in impeccable compostable wraps.'
    }
  ],

  'scented-fig-candle': [
    {
      id: 'rev-sfc-1',
      productId: 'scented-fig-candle',
      author: 'Tanvi Agarwal',
      rating: 5,
      date: '5 days ago',
      content:
        'The wild fig and cedar aroma creates such a restorative ambiance. The concrete vessel is heavy, tactile, and easily reusable after burning.'
    },
    {
      id: 'rev-sfc-2',
      productId: 'scented-fig-candle',
      author: 'Arjun Verma',
      rating: 5,
      date: '2 weeks ago',
      content:
        'The wood wick has a soft, nostalgic crackle. Clean slow burn with zero synthetic headache scents. Pure natural botanicals.'
    }
  ],

  'teak-serving-board': [
    {
      id: 'rev-tsb-1',
      productId: 'teak-serving-board',
      author: 'Aditya Rao',
      rating: 5,
      date: '1 week ago',
      content:
        'The natural grain flowing through this board is breathtaking. Sanded like silk and pre-seasoned with organic beeswax.'
    },
    {
      id: 'rev-tsb-2',
      productId: 'teak-serving-board',
      author: 'Sangeeta Pillai',
      rating: 5,
      date: '3 weeks ago',
      content:
        'Substantial reclaimed teak that elevates simple bread and cheese gatherings into memorable artisan feasts.'
    }
  ]
};

/**
 * Retrieve reviews for a given product ID.
 * Returns tailored reviews when available, or a well-curated artisan fallback set.
 *
 * @param {string} productId - Product ID to lookup
 * @param {object} [productContext] - Optional product details for dynamic personalization
 * @returns {Array} List of review objects
 */
export function getProductReviews(productId, productContext) {
  if (productId && productReviews[productId]) {
    return productReviews[productId];
  }

  // Generative fallback populated dynamically according to product artisan/item
  const makerName = productContext?.artisan || 'the artisan';
  const itemName = productContext?.name || 'this piece';

  return [
    {
      id: `rev-${productId || 'item'}-1`,
      productId: productId || 'default',
      author: 'Aarav Patel',
      rating: 5,
      date: '2 weeks ago',
      content: `The texture and craftsmanship of ${itemName} are exceptional. You can genuinely feel the time and care that went into every contour. Arrived in beautiful eco-friendly packaging.`
    },
    {
      id: `rev-${productId || 'item'}-2`,
      productId: productId || 'default',
      author: 'Meera Sen',
      rating: 5,
      date: '1 month ago',
      content: `Even more stunning in person than on the site! It has become a cherished centerpiece. Supporting ${makerName} feels deeply rewarding.`
    },
    {
      id: `rev-${productId || 'item'}-3`,
      productId: productId || 'default',
      author: 'Vikram Joshi',
      rating: 5,
      date: '1 month ago',
      content: 'Authentic handcrafted masterpiece. The earthy tones and natural finishes make it truly one of a kind. Fast and safe dispatch directly from the studio.'
    }
  ];
}

export default productReviews;
