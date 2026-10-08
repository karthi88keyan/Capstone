import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';

/**
 * NavbarComponent — top application header.
 *
 * Renders:
 *  - Brand logo (book SVG icon + "Book Worm" wordmark)
 *  - Navigation links: My Orders · My Wishlist · My Writers
 *  - Shopping-cart icon with a reactive badge driven by CartService.totalItems()
 *  - User profile avatar
 *
 * Styling: full dark theme via Tailwind CSS utility classes.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly cartService = inject(CartService);
}
