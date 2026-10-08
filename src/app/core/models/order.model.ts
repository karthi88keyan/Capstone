import { CartItem } from './cart-item.model';

/** Possible lifecycle states of a placed order. */
export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

/** Supported payment methods. */
export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'COD';

/**
 * Represents a placed order in the BookWorm store.
 * All monetary values are in Indian Rupees (₹).
 */
export interface Order {
  orderId: string;
  /** Snapshot of cart items at the time of purchase. */
  items: CartItem[];
  /** Final amount charged to the customer, in INR (₹). */
  totalAmount: number;
  /** Expected or actual delivery date. */
  deliveryDate: Date;
  orderDate: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  /**
   * Whether this order is eligible for cancellation.
   * Orders can be cancelled within 48 hours of `orderDate`.
   */
  canCancel: boolean;
}
