import { Book } from '../models/book.model';
import { Review } from '../models/review.model';

/**
 * Mock book catalogue matching the titles visible in screen-01-catalog.png.
 * Cover images use a coloured SVG placeholder encoded as a data-URI so the
 * app works offline without any external assets.
 */

function cover(bg: string, title: string, author: string): string {
  // Inline SVG cover — coloured rectangle + white title text
  const lines = title.split(' ');
  const mid = Math.ceil(lines.length / 2);
  const top = lines.slice(0, mid).join(' ');
  const bot = lines.slice(mid).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180" viewBox="0 0 120 180">
    <rect width="120" height="180" fill="${bg}"/>
    <text x="60" y="60" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="white">${top}</text>
    <text x="60" y="80" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="white">${bot}</text>
    <text x="60" y="160" text-anchor="middle" font-family="sans-serif" font-size="10" fill="rgba(255,255,255,0.8)">${author}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const MOCK_BOOKS: Book[] = [
  // ── Recommended for You ───────────────────────────────────────────────────
  {
    id: 'art-of-focus',
    title: 'The Art of Focus',
    author: 'Arjun Patel',
    description:
      'Practical guide to mastering focus & boosting productivity every day.',
    price: 399,
    originalPrice: 499,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Non-fiction', 'Self Help'],
    format: 'Paperback',
    language: 'English',
    rating: 4.5,
    reviewCount: 1240,
    sellsCount: 8900,
    coverImage: cover('#c0392b', 'THE ART OF FOCUS', 'ARJUN PATEL'),
    publisher: 'Mindful Press',
    authorBio: 'Arjun Patel is a productivity coach and bestselling author.',
    authorPhoto: '',
  },
  {
    id: 'art-of-learning',
    title: 'The Art of Learning',
    author: 'Raj Patel',
    description:
      'Master the mindset and methods for effective lifelong learning.',
    price: 259,
    originalPrice: 349,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Non-fiction', 'Self Help'],
    format: 'Paperback',
    language: 'English',
    rating: 4.3,
    reviewCount: 980,
    sellsCount: 7200,
    coverImage: cover('#e67e22', 'THE ART OF LEARNING', 'RAJ PATEL'),
    publisher: 'Growth Books',
    authorBio: 'Raj Patel is an educator and learning strategist.',
    authorPhoto: '',
  },
  {
    id: 'path-to-success',
    title: 'The Path to Success',
    author: 'James Wright',
    description: 'A practical guide to achieving goals with clarity and confidence.',
    price: 359,
    originalPrice: 449,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Non-fiction', 'Self Help'],
    format: 'Paperback',
    language: 'English',
    rating: 4.4,
    reviewCount: 1100,
    sellsCount: 6500,
    coverImage: cover('#27ae60', 'THE PATH TO SUCCESS', 'JAMES WRIGHT'),
    publisher: 'Pinnacle Press',
    authorBio: 'James Wright is a motivational speaker and life coach.',
    authorPhoto: '',
  },

  // ── Bestsellers this Month ────────────────────────────────────────────────
  {
    id: 'midnight-hour',
    title: 'The Midnight Hour',
    author: 'James Adams',
    description:
      'Haunting tale of a man\'s journey & the shadows of a forgotten past.',
    price: 299,
    originalPrice: 399,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Fiction', 'Thriller', 'Horror'],
    format: 'Paperback',
    language: 'English',
    rating: 4.6,
    reviewCount: 2300,
    sellsCount: 15000,
    coverImage: cover('#1a252f', 'THE MIDNIGHT HOUR', 'JAMES ADAMS'),
    publisher: 'Dark Ink',
    authorBio: 'James Adams writes literary thrillers exploring the human psyche.',
    authorPhoto: '',
  },
  {
    id: 'beneath-the-stars',
    title: 'Beneath the Stars',
    author: 'Jessica Martin',
    description:
      'A heartwarming tale, where two souls discover who you need.',
    price: 499,
    originalPrice: 599,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Fiction', 'Love', 'Drama'],
    format: 'Hard Cover',
    language: 'English',
    rating: 4.7,
    reviewCount: 3100,
    sellsCount: 18000,
    coverImage: cover('#8e44ad', 'BENEATH THE STARS', 'JESSICA MARTIN'),
    publisher: 'Heartfelt Books',
    authorBio: 'Jessica Martin is a romance novelist with a global readership.',
    authorPhoto: '',
  },
  {
    id: 'final-frontier',
    title: 'The Final Frontier',
    author: 'Laura Mitchell',
    description: 'A mission to space secrets to change humanity forever.',
    price: 359,
    originalPrice: 459,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Fiction', 'Thriller'],
    format: 'Paperback',
    language: 'English',
    rating: 4.5,
    reviewCount: 1800,
    sellsCount: 12000,
    coverImage: cover('#2980b9', 'THE FINAL FRONTIER', 'LAURA MITCHELL'),
    publisher: 'Orbit Books',
    authorBio: 'Laura Mitchell is a science fiction author and former aerospace engineer.',
    authorPhoto: '',
  },

  // ── New Launches ──────────────────────────────────────────────────────────
  {
    id: 'joy-of-minimalism',
    title: 'Joy of Minimalism',
    author: 'Daniel Reed',
    description: 'Declutter your life to uncover peace, clarity, and joy.',
    price: 149,
    originalPrice: 249,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Non-fiction', 'Self Help'],
    format: 'Paperback',
    language: 'English',
    rating: 4.2,
    reviewCount: 540,
    sellsCount: 3200,
    coverImage: cover('#f1c40f', 'JOY OF MINIMALISM', 'DANIEL REED'),
    publisher: 'Simple Life Press',
    authorBio: 'Daniel Reed is a minimalist lifestyle coach and speaker.',
    authorPhoto: '',
  },
  {
    id: 'vanishing-house',
    title: 'The Vanishing House',
    author: 'Clara Nelson',
    description: 'A chilling mystery unfolds within a house that disappears.',
    price: 99,
    originalPrice: 199,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Fiction', 'Horror'],
    format: 'eBook',
    language: 'English',
    rating: 4.1,
    reviewCount: 420,
    sellsCount: 2800,
    coverImage: cover('#2c3e50', 'THE VANISHING HOUSE', 'CLARA NELSON'),
    publisher: 'Dread House',
    authorBio: 'Clara Nelson writes atmospheric horror with a literary edge.',
    authorPhoto: '',
  },
  {
    id: 'lost-kitten',
    title: 'The Lost Kitten',
    author: 'Emilly Parker',
    description:
      'A heartwarming tale of courage, friendship, and feline adventure.',
    price: 339,
    originalPrice: 399,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Fiction', 'Children'],
    format: 'Hard Cover',
    language: 'English',
    rating: 4.8,
    reviewCount: 760,
    sellsCount: 5400,
    coverImage: cover('#e74c3c', 'THE LOST KITTEN', 'EMILLY PARKER'),
    publisher: 'Cozy Tales',
    authorBio: 'Emilly Parker writes uplifting stories for children of all ages.',
    authorPhoto: '',
  },

  // ── Additional books for filter variety ───────────────────────────────────
  {
    id: 'stars-and-dreams',
    title: 'Stars and Dreams',
    author: 'Priya Sharma',
    description: 'A sweeping romance set against the backdrop of Mumbai\'s film industry.',
    price: 279,
    originalPrice: 349,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Romance', 'Fiction'],
    format: 'Paperback',
    language: 'English',
    rating: 4.3,
    reviewCount: 890,
    sellsCount: 5600,
    coverImage: cover('#e91e63', 'STARS AND DREAMS', 'PRIYA SHARMA'),
    publisher: 'Dreamland Books',
    authorBio: 'Priya Sharma is a Bollywood scriptwriter turned novelist.',
    authorPhoto: '',
  },
  {
    id: 'cold-case',
    title: 'Cold Case',
    author: 'Vikram Nair',
    description: 'A detective unravels a decade-old murder in a sleepy hill town.',
    price: 319,
    originalPrice: 399,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Mystery', 'Thriller'],
    format: 'Paperback',
    language: 'English',
    rating: 4.5,
    reviewCount: 1450,
    sellsCount: 9800,
    coverImage: cover('#455a64', 'COLD CASE', 'VIKRAM NAIR'),
    publisher: 'Crime House',
    authorBio: 'Vikram Nair is a former police officer and crime fiction writer.',
    authorPhoto: '',
  },
  {
    id: 'quantum-dreams',
    title: 'Quantum Dreams',
    author: 'Anika Roy',
    description: 'In a future ruled by AI, one scientist dares to dream differently.',
    price: 429,
    originalPrice: 529,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Science Fiction', 'Fantasy'],
    format: 'eBook',
    language: 'English',
    rating: 4.6,
    reviewCount: 2100,
    sellsCount: 11000,
    coverImage: cover('#00bcd4', 'QUANTUM DREAMS', 'ANIKA ROY'),
    publisher: 'Future Ink',
    authorBio: 'Anika Roy is a computer scientist and speculative fiction author.',
    authorPhoto: '',
  },
];

/** Books tagged for the "Recommended for You" carousel */
export const RECOMMENDED: Book[] = MOCK_BOOKS.filter((b) =>
  ['art-of-focus', 'art-of-learning', 'path-to-success'].includes(b.id),
);

/** Books tagged for the "Bestsellers this Month" carousel */
export const BESTSELLERS: Book[] = MOCK_BOOKS.filter((b) =>
  ['midnight-hour', 'beneath-the-stars', 'final-frontier'].includes(b.id),
);

/** Books tagged for the "New Launches" carousel */
export const NEW_LAUNCHES: Book[] = MOCK_BOOKS.filter((b) =>
  ['joy-of-minimalism', 'vanishing-house', 'lost-kitten'].includes(b.id),
);

/** Flat list of all category labels for the sidebar */
export const CATEGORIES: string[] = [
  'All',
  'Romance',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Historical',
  'Biography',
  'Self-help',
  'Memoir',
  'Travel',
  'Cooking',
  "Children's",
  'Young Adult',
  'Comics & Graphic Novels',
  'Poetry',
  'Drama',
  'Science',
  'Philosophy',
  'Religion',
  'Language Learning',
];

/** Generates a large SVG back-cover blurb placeholder for the detail page. */
export function backCover(bg: string, quote: string, body: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="240" viewBox="0 0 160 240">
    <rect width="160" height="240" fill="${bg}"/>
    <text x="80" y="28" text-anchor="middle" font-family="serif" font-size="9" font-style="italic" fill="rgba(0,0,0,0.7)">"${quote}"</text>
    <foreignObject x="10" y="42" width="140" height="150">
      <body xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif;font-size:8px;color:rgba(0,0,0,0.8);line-height:1.4">${body}</body>
    </foreignObject>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

/** Mock reviews keyed by book id. */
export const MOCK_REVIEWS: Record<string, Review[]> = {
  'joy-of-minimalism': [
    {
      id: 'r1',
      reviewerName: 'John Smith',
      rating: 5,
      comment:
        'The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.',
      date: '2024-06-10',
    },
    {
      id: 'r2',
      reviewerName: 'Priya Mehta',
      rating: 4,
      comment:
        'A wonderfully calming read. Daniel Reed has a gift for making simplicity feel achievable. I have already started decluttering my home after the first chapter!',
      date: '2024-05-22',
    },
  ],
  'art-of-focus': [
    {
      id: 'r3',
      reviewerName: 'Rahul Gupta',
      rating: 5,
      comment:
        'Absolutely life-changing. The practical exercises at the end of every chapter made all the difference for me.',
      date: '2024-07-01',
    },
  ],
  'midnight-hour': [
    {
      id: 'r4',
      reviewerName: 'Sara Ali',
      rating: 4,
      comment: 'Gripping from page one. Couldn\'t put it down. The atmosphere is hauntingly beautiful.',
      date: '2024-06-18',
    },
  ],
};
