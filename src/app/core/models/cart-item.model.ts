import { Book } from './book.model';

/** A single line-item in the shopping cart. */
export interface CartItem {
  book: Book;
  quantity: number;
}
