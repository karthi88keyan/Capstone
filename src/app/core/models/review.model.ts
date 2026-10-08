/** A single user review for a book. */
export interface Review {
  id: string;
  reviewerName: string;
  /** Star rating 1–5. */
  rating: number;
  comment: string;
  /** ISO date string, e.g. "2024-06-15". */
  date: string;
}
