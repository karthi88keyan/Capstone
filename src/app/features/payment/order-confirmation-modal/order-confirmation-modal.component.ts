import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartItem } from '../../../core/models/cart-item.model';
import { CartService } from '../../../core/services/cart.service';

/**
 * OrderConfirmationModalComponent — screen-05-confirmation-modal.png.
 *
 * Shown after payment succeeds. Displays purchased books, then routes back
 * to the catalog when "Continue your Shopping" is clicked.
 */
@Component({
  selector: 'app-order-confirmation-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderConfirmationModalComponent implements OnInit, OnDestroy {
  /** Snapshot of the cart at the time of purchase (passed in before cart is cleared). */
  readonly purchasedItems = input<CartItem[]>([]);
  /** Emitted when the user clicks "Continue your Shopping". */
  readonly continueShoppingClicked = output<void>();

  private readonly dialogRef =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  protected readonly cartService = inject(CartService);

  ngOnInit(): void {
    const el = this.dialogRef().nativeElement;
    el.showModal();
    el.addEventListener('click', this.onBackdropClick);
  }

  ngOnDestroy(): void {
    this.dialogRef().nativeElement.removeEventListener('click', this.onBackdropClick);
  }

  continueShopping(): void {
    this.cartService.clearCart();
    this.dialogRef().nativeElement.close();
    this.continueShoppingClicked.emit();
  }

  private readonly onBackdropClick = (e: MouseEvent): void => {
    const rect = this.dialogRef().nativeElement.getBoundingClientRect();
    const outside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom;
    if (outside) this.continueShopping();
  };
}
