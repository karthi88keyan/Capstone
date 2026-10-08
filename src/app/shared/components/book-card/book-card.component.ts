import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Book } from '../../../core/models/book.model';
import { CartService } from '../../../core/services/cart.service';

/**
 * BookCardComponent — horizontal card layout matching screen-01-catalog.png.
 *
 * Displays: cover art, title, author link, description, format, category tags,
 * price (₹), delivery date badge, and an "Add to Cart" action.
 */
@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './book-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCardComponent {
  readonly book = input.required<Book>();

  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);

  navigateToDetail(): void {
    this.router.navigate(['/book', this.book().id]);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(this.book());
  }
}
