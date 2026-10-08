import { computed, Injectable, signal } from '@angular/core';

import { MOCK_BOOKS } from '../data/mock-books.data';
import { Book, CartItem, Order, OrderStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  // ─── State ────────────────────────────────────────────────────────────────

  /** Store placed orders. */
  private readonly _orders = signal<Order[]>([]);

  /** Expose readonly signal of orders. */
  readonly orders = computed(() => this._orders());

  constructor() {
    // Seed initial orders so the history page is not empty upon first load
    this.seedMockOrders();
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /** Adds a new order to the history list (at the top). */
  addOrder(order: Order): void {
    this._orders.update((prev) => [order, ...prev]);
  }

  /**
   * Cancel an order if it is within 48 hours and not already cancelled.
   */
  cancelOrder(orderId: string): void {
    this._orders.update((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          // Verify age is under 48 hours
          const ageHours = (new Date().getTime() - new Date(ord.orderDate).getTime()) / (1000 * 60 * 60);
          if (ageHours < 48 && ord.status !== 'Cancelled') {
            return {
              ...ord,
              status: 'Cancelled' as OrderStatus,
              canCancel: false,
            };
          }
        }
        return ord;
      }),
    );
  }

  /**
   * Computed signal to get recommendations based on the user's order history.
   * Recommendations algorithm:
   * 1. Extract categories of all books purchased in orders (excluding Cancelled orders if we want, or from all orders).
   * 2. Find all books in MOCK_BOOKS that belong to at least one of these categories.
   * 3. Filter out books that have already been purchased (and are in non-cancelled or any orders).
   * 4. If list is empty, default to recommending Bestsellers/popular books from MOCK_BOOKS.
   */
  readonly recommendations = computed<Book[]>(() => {
    const ordersList = this._orders();
    
    // Get list of purchased book IDs (from active, non-cancelled orders)
    const activeOrders = ordersList.filter(o => o.status !== 'Cancelled');
    const purchasedBookIds = new Set<string>();
    const purchasedCategories = new Set<string>();

    activeOrders.forEach((order) => {
      order.items.forEach((item) => {
        purchasedBookIds.add(item.book.id);
        item.book.categories.forEach((cat) => purchasedCategories.add(cat));
      });
    });

    // If no active purchases, fall back to recommending general self-help/fiction bestsellers
    if (purchasedCategories.size === 0) {
      // Return 3 popular books
      return MOCK_BOOKS.slice(0, 4);
    }

    // Filter books matching purchased categories, excluding already purchased books
    const recs = MOCK_BOOKS.filter(
      (book) =>
        !purchasedBookIds.has(book.id) &&
        book.categories.some((cat) => purchasedCategories.has(cat))
    );

    // If we have some recommendations, return them (up to 4)
    if (recs.length > 0) {
      return recs.slice(0, 4);
    }

    // Default fallback
    return MOCK_BOOKS.filter((book) => !purchasedBookIds.has(book.id)).slice(0, 4);
  });

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private seedMockOrders(): void {
    const now = new Date();

    // 1. Order placed 4 hours ago (eligible for cancellation)
    const recentOrderDate = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const recentDeliveryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    const recentItems: CartItem[] = [
      {
        book: MOCK_BOOKS.find((b) => b.id === 'art-of-focus') || MOCK_BOOKS[0],
        quantity: 1,
      },
      {
        book: MOCK_BOOKS.find((b) => b.id === 'art-of-learning') || MOCK_BOOKS[1],
        quantity: 2,
      },
    ];
    const recentSubtotal = recentItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const recentTax = parseFloat((recentSubtotal * 0.12).toFixed(2));
    const recentDiscount = 100;
    const recentTotal = Math.max(0, recentSubtotal + recentTax - recentDiscount);

    // 2. Order placed 3 days (72 hours) ago (not eligible for cancellation)
    const oldOrderDate = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    const oldDeliveryDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // Delivered yesterday
    const oldItems: CartItem[] = [
      {
        book: MOCK_BOOKS.find((b) => b.id === 'midnight-hour') || MOCK_BOOKS[3],
        quantity: 1,
      },
    ];
    const oldSubtotal = oldItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const oldTax = parseFloat((oldSubtotal * 0.12).toFixed(2));
    const oldDiscount = 50;
    const oldTotal = Math.max(0, oldSubtotal + oldTax - oldDiscount);

    this._orders.set([
      {
        orderId: 'ORD-89472',
        items: recentItems,
        totalAmount: recentTotal,
        orderDate: recentOrderDate,
        deliveryDate: recentDeliveryDate,
        status: 'Confirmed',
        paymentMethod: 'UPI',
        canCancel: true,
      },
      {
        orderId: 'ORD-71329',
        items: oldItems,
        totalAmount: oldTotal,
        orderDate: oldOrderDate,
        deliveryDate: oldDeliveryDate,
        status: 'Delivered',
        paymentMethod: 'Credit Card',
        canCancel: false,
      },
    ]);
  }
}
