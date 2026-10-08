import { computed, Injectable, signal } from '@angular/core';

import { Book, CartItem } from '../models';

/** GST rate applied to all book purchases (12 %). */
const GST_RATE = 0.12;

/**
 * Known coupon codes and their fixed INR (₹) discount amounts.
 * Extend this map or replace with a backend lookup as needed.
 */
const COUPON_DISCOUNTS: Readonly<Record<string, number>> = {
  BOOKWORM10: 10,
  BOOKWORM50: 50,
  BOOKWORM100: 100,
  FIRSTORDER: 150,
  FESTIVE200: 200,
  SAVE100: 100,
};

/**
 * CartService — manages the shopping-cart state using Angular Signals.
 *
 * Reactive surface
 * ────────────────
 *  cartItems  — writable signal holding the current line-items
 *  subtotal   — computed: sum of (price × quantity) for every item
 *  tax        — computed: 12 % GST on the subtotal
 *  discount   — writable signal; default ₹100 flat discount
 *  grandTotal — computed: subtotal + tax − discount (floored at 0)
 *
 * All monetary values are in Indian Rupees (₹).
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  // ─── State ────────────────────────────────────────────────────────────────

  /** Current cart line-items. */
  readonly cartItems = signal<CartItem[]>([]);

  /** Applied flat discount in INR; defaults to ₹100 coupon credit. */
  readonly discount = signal<number>(100);

  // ─── Derived / computed ───────────────────────────────────────────────────

  /** Sum of price × quantity across all cart items (pre-tax). */
  readonly subtotal = computed<number>(() =>
    this.cartItems().reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0,
    ),
  );

  /** 12 % GST levied on the subtotal. */
  readonly tax = computed<number>(() =>
    parseFloat((this.subtotal() * GST_RATE).toFixed(2)),
  );

  /**
   * Amount the customer actually pays.
   * grandTotal = subtotal + tax − discount  (minimum ₹0)
   */
  readonly grandTotal = computed<number>(() =>
    Math.max(0, parseFloat((this.subtotal() + this.tax() - this.discount()).toFixed(2))),
  );

  /** Total number of individual units in the cart. */
  readonly itemCount = computed<number>(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0),
  );

  /**
   * Alias for {@link itemCount} — total units across all cart line-items.
   * Exposed as `totalItems` for template convenience (e.g. navbar badge).
   */
  readonly totalItems = this.itemCount;

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Add a book to the cart.
   * If the book is already present, its quantity is incremented by 1.
   */
  addToCart(book: Book): void {
    this.cartItems.update((items) => {
      const existing = items.find((i) => i.book.id === book.id);
      if (existing) {
        return items.map((i) =>
          i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...items, { book, quantity: 1 }];
    });
  }

  /**
   * Remove a book entirely from the cart by its id.
   * No-op when the id is not found.
   */
  removeFromCart(bookId: string): void {
    this.cartItems.update((items) => items.filter((i) => i.book.id !== bookId));
  }

  /**
   * Adjust the quantity of a cart item by `delta` (+1 or −1).
   *
   * - When the resulting quantity drops to 0 (or below), the item is removed.
   * - No-op when `bookId` is not in the cart.
   *
   * @param bookId  Identifier of the book to adjust.
   * @param delta   Change to apply (+1 to increment, −1 to decrement).
   */
  updateQuantity(bookId: string, delta: number): void {
    this.cartItems.update((items) =>
      items
        .map((i) =>
          i.book.id === bookId ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  /**
   * Apply a coupon code.
   *
   * Valid codes update the `discount` signal with a fixed INR amount.
   *
   * @returns `true` when the code is recognised; `false` otherwise.
   *
   * @example
   *   const applied = cartService.applyCoupon('BOOKWORM50'); // discount → ₹50
   */
  applyCoupon(code: string): boolean {
    const amount = COUPON_DISCOUNTS[code.trim().toUpperCase()];
    if (amount === undefined) {
      return false;
    }
    this.discount.set(amount);
    return true;
  }

  /** Remove any applied coupon and reset discount to ₹0. */
  removeCoupon(): void {
    this.discount.set(0);
  }

  /** Empty the cart completely. */
  clearCart(): void {
    this.cartItems.set([]);
  }
}
