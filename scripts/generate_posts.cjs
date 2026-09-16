const fs = require('fs');
const path = require('path');

// Read products
const productsFile = fs.readFileSync(path.join(__dirname, '../src/data/products.js'), 'utf-8');
let products = [];
try {
  const match = productsFile.match(/export const products = (\[[\s\S]*?\]);/);
  if (match) {
    products = eval(match[1]);
  }
} catch (e) {
  console.error('Error parsing products:', e);
}

console.log('Loaded products count:', products.length);

const authors = [
  { name: 'Maya Sharma', role: 'Potter & Ceramicist', handle: '@mayaceramics', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
  { name: 'Rajesh & Kavita Dev', role: 'Master Weavers', handle: '@devhandloom', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { name: 'Ananya Roy', role: 'Botanical Wax Artisan', handle: '@ananyabotanicals', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
  { name: 'Vikram & Sunita', role: 'Terracotta Artisans', handle: '@terracottatales', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
  { name: 'Elena Fernandes', role: 'Textile & Macrame Artist', handle: '@elenamacrame', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
  { name: 'Aarav Patel', role: 'Woodcraft & Joinery', handle: '@aaravwoodcraft', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop' },
  { name: 'Priya Sundaram', role: 'Brass & Metal Sculptor', handle: '@priyametals', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop' },
  { name: 'Kabir & Meera', role: 'Leather Craftsmen', handle: '@kabirleather', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop' },
  { name: 'Siddharth Varma', role: 'Glassblower & Sculptor', handle: '@siddharthglass', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop' },
  { name: 'Tara Deshmukh', role: 'Natural Dye & Indigo', handle: '@taraindigo', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200&auto=format&fit=crop' },
  { name: 'Rohan Gupta', role: 'Aromatherapy & Candle', handle: '@rohanwaxco', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
  { name: 'Asha Mehta', role: 'Silversmith & Jeweler', handle: '@ashasilver', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
  { name: 'Nikhil Chawla', role: 'Ceramic Studio', handle: '@nikhilceramics', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
  { name: 'Diya Sengupta', role: 'Printmaker & Painter', handle: '@diyaprints', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' },
  { name: 'Zainab Qureshi', role: 'Embroidery & Zari', handle: '@zainabembroidery', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=crop' }
];

const craftCaptions = [
  'Fresh off the potter’s wheel this morning! Testing out a brand new mineral-ash glaze with rich earthen undertones. Every batch takes over 48 hours of slow firing in our wood kiln to achieve this unique rustic finish.',
  'Hand-woven on our traditional 4-shaft floor loom. The rhythm of the shuttle never gets old after 14 hours of continuous weaving. Spun from organic certified cotton and dyed with Himalayan walnut bark extracts.',
  'Pouring a fresh batch of wild fig & cedarwood soy candles into hand-cast concrete jars. Pure calm for your living space, crafted with lead-free cotton wicks and sustainable botanical essences.',
  'Kiln opening day! Always the most thrilling and nerve-wracking moment in the pottery studio. Look at those crackle textures and warm ember gradients developed during the 1200°C reduction atmosphere.',
  'Carving reclaimed teak wood into organic serving bowls. Preserving natural wood grain ripples and natural tree knots so every single piece carries its own unique forest story.',
  'Dipping handspun organic cotton yarns into the natural indigo vat. Layering 6 slow dips creates this deep oceanic navy hue that deepens gracefully with age and exposure to sunlight.',
  'Hammering 925 sterling silver botanical earrings inspired by leaves found on our morning monsoon trail. Each curve is hand-chiseled with jeweler precision and finished with satin polish.',
  'Hand-stitching full-grain vegetable-tanned leather desk trays. Durable, timeless, and ages with a stunning deep caramel patina that gets better with everyday handling and use.',
  'Studio morning light hitting our newest hand-blown recycled glass vessels. Subtle air bubbles give each piece its soul, capturing sunlight like amber drops across the room.',
  'Intricate macrame wall hanging finished using unbleached combed cotton cord and salvaged driftwood from the coast. Designed to bring organic warmth and calming texture into modern minimalist spaces.',
  'Block printing geometric patterns using hand-carved rosewood blocks and organic pomegranate rind dyes. Traditional heritage printing techniques preserved across 4 generations in our family studio.',
  'Sculpting terracotta planters with ancient floral reliefs. Sun-baked for 3 days before entering the wood-fired kiln, yielding rich earthy tones that breathe life into indoor botanical gardens.',
  'Testing a new botanical formulation: bergamot, lavender, and cold-pressed vetiver oils poured with cotton wicks for long-lasting clean burn and grounding evening aromatics.',
  'Hand-forging brass cutlery with textured handles. Bringing warmth and heirloom quality to everyday dining tables, crafted from 100% recycled brass metal.',
  'Slow craftsmanship in progress. Every single knot, stitch, and turn is done with mindful attention to detail, honouring the slow rhythm of traditional handmade culture.',
  'Just packaged up these stoneware tea sets for our collectors across the country. Grateful for this craft community and your continuous support for slow living artisans!',
  'Turning raw white river clay into delicate coffee cups. The tactile warmth of ceramic in your hands makes every morning better, creating a mindful coffee ritual you look forward to daily.',
  'Custom handloom throw blanket with intricate herringbone borders. 100% natural wool sourced from Himalayan pastoralists, hand-spun and woven on traditional pit looms.',
  'Experimenting with raku firing techniques! The iridescent smoke effects never cease to amaze me, creating one-of-a-kind metallic copper luster across stoneware surfaces.',
  'Handmade with love and patience. When you support handmade, you support human hands, generational heritage, and mindful sustainable creation for mindful modern homes.'
];

const craftImages = [
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528458876861-544fd1761a91?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop'
];

const tagSets = [
  ['#pottery', '#stoneware', '#artisan', '#handmade', '#craftinator'],
  ['#handloom', '#naturaldyes', '#slowtextiles', '#sustainable'],
  ['#botanical', '#handpoured', '#soywax', '#homefragrance'],
  ['#terracotta', '#claycraft', '#kilnfire', '#heritagecraft'],
  ['#macrame', '#fiberart', '#bohohome', '#coastalcraft'],
  ['#woodcraft', '#handcarved', '#reclaimedwood', '#slowliving'],
  ['#metalsmith', '#solidbrass', '#handhammered', '#tableware'],
  ['#leathercraft', '#vegantanned', '#handstitched', '#heirloom'],
  ['#slowliving', '#minimalhome', '#artisanmade', '#craftinator'],
  ['#sustainableliving', '#ecofriendly', '#zerowaste', '#handcrafted']
];

const timeAgoes = ['12m ago', '40m ago', '1h ago', '2h ago', '3h ago', '5h ago', '7h ago', '11h ago', '1d ago', '2d ago', '3d ago', '4d ago', '1w ago'];

const generatedPosts = [];

for (let i = 1; i <= 104; i++) {
  const author = authors[(i - 1) % authors.length];
  // Tag product on ~40% of posts, rest null
  const hasProduct = (i % 2 === 0) || (i % 5 === 0);
  const prod = (hasProduct && products.length > 0) ? products[(i - 1) % products.length] : null;
  const caption = craftCaptions[(i - 1) % craftCaptions.length];
  const tags = tagSets[(i - 1) % tagSets.length];

  // Number of images for interactive slider (1 to 4 images per post)
  const imageCount = (i % 3 === 0) ? 4 : (i % 2 === 0) ? 3 : 2;
  const postImages = [];
  const primaryImg = prod ? prod.image : craftImages[(i - 1) % craftImages.length];
  postImages.push(primaryImg);
  for (let j = 1; j < imageCount; j++) {
    postImages.push(craftImages[(i * 3 + j * 7) % craftImages.length]);
  }

  const post = {
    id: i,
    author: author.name,
    authorName: author.name,
    authorRole: author.role,
    handle: author.handle,
    avatar: author.avatar,
    authorAvatar: author.avatar,
    images: postImages,
    mainImg: primaryImg,
    mediaImg: primaryImg,
    mediaAlt: `${author.name} craft showcase`,
    caption: caption,
    text: caption,
    hashtags: tags,
    tags: tags,
    likes: (120 + (i * 47) % 3200).toLocaleString(),
    comments: (8 + (i * 13) % 240).toLocaleString(),
    savedCount: 15 + (i * 19) % 450,
    isLiked: i % 4 === 0,
    isSaved: i % 6 === 0,
    isFollowing: false,
    timeAgo: timeAgoes[i % timeAgoes.length],
    product: prod ? {
      id: prod.id,
      name: prod.name,
      artisan: prod.artisan,
      artisanCity: prod.artisanCity,
      price: prod.price,
      rating: prod.rating,
      image: prod.image,
      category: prod.category,
      badge: prod.badge || 'Artisan Direct'
    } : null
  };

  generatedPosts.push(post);
}

const fileContent = `/**
 * Curated Community Feed Posts Dataset (100+ items)
 * Includes multi-image sliders, artisan updates, workshop stories,
 * optional tagged products, and rich expandable captions.
 * Compatible with both HomePage 3D Deck and CommunityPage Social Stream.
 */

export const communityPosts = ${JSON.stringify(generatedPosts, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/communityPosts.js'), fileContent, 'utf-8');
console.log('Successfully regenerated communityPosts.js with ' + generatedPosts.length + ' posts!');
