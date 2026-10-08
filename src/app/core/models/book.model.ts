/** Available physical and digital formats for a book listing. */
export type BookFormat = 'Paperback' | 'Hard Cover' | 'eBook';

/**
 * Represents a single book product in the BookWorm store.
 * All monetary values are in Indian Rupees (₹).
 */
export interface Book {
  /** Unique product identifier. */
  id: string;
  title: string;
  author: string;
  description: string;
  /** Current selling price in INR (₹). */
  price: number;
  /** MRP / original price before any discount, in INR (₹). */
  originalPrice: number;
  /** Human-readable delivery estimate tag, e.g. "Delivers in 2–4 days". */
  deliveryDateTag: string;
  /** One or more genre / subject categories. */
  categories: string[];
  format: BookFormat;
  language: string;
  /** Average star rating out of 5. */
  rating: number;
  reviewCount: number;
  /** Number of copies sold — used for popularity ranking. */
  sellsCount: number;
  /** URL or data-URI of the cover image. */
  coverImage: string;
  publisher: string;
  authorBio: string;
  /** URL or data-URI of the author's photo. */
  authorPhoto: string;
}
