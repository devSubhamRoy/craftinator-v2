/**
 * Craftinator-v2 Studio Messaging & Artisan Direct Chat Dataset
 * Curated conversational threads between patrons, craft guilds, and master artisans.
 */

export const initialConversations = [
  {
    id: 'conv-community-guild',
    artisanId: 'craft-guild',
    artisanName: 'Artisan Guild Dispatch',
    craft: 'Official Guild Broadcast',
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop',
    city: 'National Crafts Council',
    studioName: 'Craftinator Guild',
    onlineStatus: 'online',
    statusText: 'Verified Craft Collective · Read-only broadcast',
    responseRate: 'Official announcements only',
    unreadCount: 0,
    isCustomOrder: false,
    isReadOnly: true,
    readOnlyNotice: 'This channel is currently in broadcast read-only mode.',
    verified: true,
    timeAgo: '6d',
    messages: [
      {
        id: 'msg-g1',
        sender: 'artisan',
        text: 'Welcome to the Craftinator Guild community dispatch! Master artisans from 14 regions have published autumn kiln and loom schedules.',
        timestamp: '5:47 PM',
        status: 'read'
      },
      {
        id: 'msg-g2',
        sender: 'artisan',
        text: 'The Jaipur Sanganer Pottery Exhibition begins this weekend. Studio open-days are now live for Patron registrations.',
        timestamp: '5:49 PM',
        status: 'read',
        linkAttachment: {
          url: 'https://craftinator.art/exhibitions/jaipur-2026',
          title: 'Jaipur Sanganer Atelier Open-Days 2026'
        }
      },
      {
        id: 'msg-g3',
        sender: 'artisan',
        text: 'Bespoke commission request slots for Diwali giftings are filling fast. Please connect directly with respective makers.',
        timestamp: '6:17 PM',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-maya-sharma',
    artisanId: 'maya-sharma',
    artisanName: 'Maya Sharma',
    craft: 'Ceramic Artist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    city: 'Jaipur, Rajasthan',
    studioName: 'Studio Mati',
    onlineStatus: 'online',
    statusText: 'Active in Jaipur studio · Replies in ~30m',
    responseRate: 'Typically replies within 30 mins',
    unreadCount: 2,
    isCustomOrder: true,
    isReadOnly: false,
    verified: true,
    timeAgo: '14w',
    quickReplies: [
      'Can you customize this in terracotta tone?',
      'What is the dispatch time to Mumbai?',
      'Is this piece dishwasher and microwave safe?'
    ],
    messages: [
      {
        id: 'msg-m1',
        sender: 'artisan',
        text: 'Namaste! Welcome to Studio Mati. I craft each ceramic vessel individually on the slow wheel in our Jaipur courtyard.',
        timestamp: '10:30 AM',
        status: 'read'
      },
      {
        id: 'msg-m2',
        sender: 'user',
        text: 'Hello Maya! I love your stoneware pottery collection. I was looking at the Sanganer vase.',
        timestamp: '10:32 AM',
        status: 'read'
      },
      {
        id: 'msg-m3',
        sender: 'user',
        text: 'Can this vase hold fresh flower stems with water, or is it decorative only?',
        timestamp: '10:33 AM',
        status: 'read',
        productAttachment: {
          id: 'p1',
          name: 'Sanganer Stoneware Minimalist Vase',
          price: 2400,
          category: 'Ceramics',
          image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=600&auto=format&fit=crop'
        }
      },
      {
        id: 'msg-m4',
        sender: 'artisan',
        text: 'Yes, absolutely! It is vitrified at 1,250°C in our reduction kiln, making the stoneware completely watertight, non-porous, and food-safe.',
        timestamp: '10:38 AM',
        status: 'read'
      },
      {
        id: 'msg-m5',
        sender: 'artisan',
        text: 'Here is a photo of the glaze texture under natural daylight from this morning\'s kiln unloading:',
        timestamp: '10:40 AM',
        status: 'read',
        mediaAttachment: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop',
          caption: 'Natural wood-ash reduction glaze finish'
        }
      },
      {
        id: 'msg-m6',
        sender: 'artisan',
        text: 'Would you like me to hand-carve a small personalized inscription beneath the foot ring before dispatch?',
        timestamp: '11:15 AM',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv-arjun-das',
    artisanId: 'arjun-das',
    artisanName: 'Arjun Das',
    craft: 'Woodcraft Artist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    city: 'Saharanpur, Uttar Pradesh',
    studioName: 'Heritage Woodworks',
    onlineStatus: 'away',
    statusText: 'In workshop carving · Replies in ~2h',
    responseRate: 'Replies in ~2 hours',
    unreadCount: 0,
    isCustomOrder: true,
    isReadOnly: false,
    verified: true,
    timeAgo: '184w',
    quickReplies: [
      'Can you craft this in reclaimed teak?',
      'What dimensions are available?',
      'How do I care for hand-rubbed walnut oil finish?'
    ],
    messages: [
      {
        id: 'msg-a1',
        sender: 'user',
        text: 'Hi Arjun! Inquiring about a custom 8-seater dining tray set in seasoned Sheesham wood.',
        timestamp: '5:49 PM',
        status: 'read'
      },
      {
        id: 'msg-a2',
        sender: 'artisan',
        text: 'Greetings! I would be honored to craft this for your family. We use sustainably salvaged timber with hand-chiseled brass inlay.',
        timestamp: '5:59 PM',
        status: 'read',
        customQuoteAttachment: {
          title: 'Custom Sheesham Platter Set (8 Pcs)',
          quoteAmount: 5800,
          estimatedDays: '5-7 business days',
          status: 'Proposal Ready'
        }
      },
      {
        id: 'msg-a3',
        sender: 'user',
        text: 'The quote looks great. Please proceed with the brass inlay work as discussed!',
        timestamp: '6:07 PM',
        status: 'read'
      },
      {
        id: 'msg-a4',
        sender: 'artisan',
        text: 'Understood. Timber selection is complete. I will share a progress photo once the jointing is done.',
        timestamp: '6:17 PM',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-priya-patel',
    artisanId: 'priya-patel',
    artisanName: 'Priya Patel',
    craft: 'Handloom Weaver',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    city: 'Patan, Gujarat',
    studioName: 'Patola Heritage Loom',
    onlineStatus: 'online',
    statusText: 'At handloom studio · Replies in ~1h',
    responseRate: 'Typically replies in 1 hour',
    unreadCount: 1,
    isCustomOrder: false,
    isReadOnly: false,
    verified: true,
    timeAgo: '2d',
    quickReplies: [
      'Is natural indigo dye used?',
      'Can you share a video of the loom weaving?'
    ],
    messages: [
      {
        id: 'msg-p1',
        sender: 'artisan',
        text: 'Hello! Thank you for supporting slow textile heritage. All our yarn is organic cotton spun by village cooperatives in Kutch.',
        timestamp: 'Sep 23',
        status: 'read'
      },
      {
        id: 'msg-p2',
        sender: 'user',
        text: 'Hi Priya, I received the Indigo Dabu Block Print Throw today. The weave texture is extraordinary!',
        timestamp: 'Sep 23',
        status: 'read'
      },
      {
        id: 'msg-p3',
        sender: 'artisan',
        text: 'That brings immense joy to our weaver family! May it bring warmth to your sanctuary.',
        timestamp: 'Sep 24',
        status: 'read'
      },
      {
        id: 'msg-p4',
        sender: 'artisan',
        text: 'We just finished a new batch of marigold-dyed cushions if you\'d like first preview.',
        timestamp: '11:45 AM',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv-meera-joshi',
    artisanId: 'meera-joshi',
    artisanName: 'Meera Joshi',
    craft: 'Metalsmith & Jewelry',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    city: 'Cuttack, Odisha',
    studioName: 'Tarakasi Filigree Guild',
    onlineStatus: 'offline',
    statusText: 'Offline · Last seen 4h ago',
    responseRate: 'Replies within 24 hours',
    unreadCount: 0,
    isCustomOrder: true,
    isReadOnly: false,
    verified: true,
    timeAgo: '1w',
    quickReplies: [
      'Is 925 sterling silver hallmarked?',
      'Do you offer custom ring sizes?'
    ],
    messages: [
      {
        id: 'msg-j1',
        sender: 'user',
        text: 'Namaste Meera, do you take custom filigree pendant commissions with patron-supplied gemstones?',
        timestamp: 'Sep 21',
        status: 'read'
      },
      {
        id: 'msg-j2',
        sender: 'artisan',
        text: 'Namaste! Yes, our silver wire filigree artisans can set ethical cabochons. Share your stone dimensions and we will craft a preliminary design.',
        timestamp: 'Sep 22',
        status: 'read'
      }
    ]
  }
];
