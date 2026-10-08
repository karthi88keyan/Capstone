import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { Book, Order } from '../../core/models';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, NgClass, BookCardComponent],
  templateUrl: './order-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent {
  protected readonly ordersService = inject(OrdersService);
  private readonly cartService = inject(CartService);

  readonly notification = signal<string | null>(null);

  /** Buy a book again by adding it directly to the active cart. */
  buyAgain(book: Book): void {
    this.cartService.addToCart(book);
    this.showNotification(`"${book.title}" added to your cart!`);
  }

  /** Cancel an eligible order. */
  cancelOrder(orderId: string): void {
    this.ordersService.cancelOrder(orderId);
    this.showNotification(`Order ${orderId} has been successfully cancelled.`);
  }

  /** Check if an order can be cancelled (under 48 hours and not already Cancelled). */
  isEligibleForCancellation(order: Order): boolean {
    if (order.status === 'Cancelled') {
      return false;
    }
    const ageHours = (new Date().getTime() - new Date(order.orderDate).getTime()) / (1000 * 60 * 60);
    return ageHours < 48;
  }

  private showNotification(message: string): void {
    this.notification.set(message);
    setTimeout(() => {
      this.notification.set(null);
    }, 3500);
  }
}
