import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CartItem } from '../../core/models/cart-item.model';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { OrderConfirmationModalComponent } from '../payment/order-confirmation-modal/order-confirmation-modal.component';
import { PaymentModalComponent } from '../payment/payment-modal/payment-modal.component';

/** Country-dialling-code options shown in the phone prefix dropdown. */
const DIAL_CODES = ['+91', '+1', '+44', '+61', '+971'];

/** Indian states for the State dropdown. */
const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

/** Country list (abbreviated for the dropdown). */
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Australia', 'UAE'];

/** Validators.pattern for a 6-digit Indian PIN. */
function pinValidator(c: AbstractControl): ValidationErrors | null {
  return /^\d{6}$/.test(c.value) ? null : { invalidPin: true };
}

/** Validators.pattern for a 10-digit phone number. */
function phoneValidator(c: AbstractControl): ValidationErrors | null {
  return /^\d{10}$/.test(c.value) ? null : { invalidPhone: true };
}

/**
 * CartCheckoutComponent — screen-03-cart-checkout.png.
 *
 * Sections:
 *  1. Cart items strip     — horizontal list driven by CartService.cartItems()
 *  2. Address reactive form — all fields with validation
 *  3. Order Summary card   — computed totals, coupon input, Pay Now button
 *
 * Pay Now opens PaymentModalComponent (screen-04).
 * On payment success, shows OrderConfirmationModalComponent (screen-05).
 */
@Component({
  selector: 'app-cart-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PaymentModalComponent, OrderConfirmationModalComponent],
  templateUrl: './cart-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartCheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);

  // ─── Static reference data ────────────────────────────────────────────────
  readonly dialCodes = DIAL_CODES;
  readonly states = INDIAN_STATES;
  readonly countries = COUNTRIES;

  // ─── Coupon UI state ──────────────────────────────────────────────────────
  readonly couponCode = signal<string>('');
  readonly couponMessage = signal<string>('');
  readonly couponApplied = signal<boolean>(false);

  // ─── Modal visibility signals ─────────────────────────────────────────────
  /** Whether the PaymentModal is shown. */
  readonly showPaymentModal = signal<boolean>(false);
  /** Whether the OrderConfirmation modal is shown. */
  readonly showConfirmationModal = signal<boolean>(false);
  /** Track if order has been successfully placed. */
  readonly orderPlaced = signal<boolean>(false);
  /**
   * Snapshot of items taken just before cart is cleared.
   * Passed to OrderConfirmationModal so it can display them.
   */
  readonly purchasedItems = signal<CartItem[]>([]);

  // ─── "Use Saved Address" toggle ───────────────────────────────────────────
  readonly useSavedAddress = signal<boolean>(false);

  // ─── Computed cart helpers ────────────────────────────────────────────────
  /** Number of unique titles (line-items) in the cart. */
  readonly itemCount = computed(() => this.cartService.cartItems().length);

  // ─── Address Reactive Form ────────────────────────────────────────────────
  readonly addressForm = this.fb.group({
    firstName:   ['', [Validators.required, Validators.minLength(2)]],
    lastName:    ['', [Validators.required, Validators.minLength(2)]],
    addressLine: ['', [Validators.required, Validators.minLength(5)]],
    email:       ['', [Validators.required, Validators.email]],
    city:        ['', Validators.required],
    pin:         ['', [Validators.required, pinValidator]],
    dialCode:    ['+91'],
    phone:       ['', [Validators.required, phoneValidator]],
    state:       ['', Validators.required],
    country:     ['India', Validators.required],
  });

  /** Mock saved address — pre-fills the form when "Use Saved Address" is ticked. */
  private readonly SAVED_ADDRESS = {
    firstName: 'Ravi', lastName: 'Kumar',
    addressLine: '42, MG Road, Bengaluru', email: 'ravi@example.com',
    city: 'Bengaluru', pin: '560001',
    dialCode: '+91', phone: '9876543210',
    state: 'Karnataka', country: 'India',
  };

  ngOnInit(): void {}

  // ─── Quantity controls ────────────────────────────────────────────────────
  increment(item: CartItem): void {
    this.cartService.updateQuantity(item.book.id, +1);
  }

  decrement(item: CartItem): void {
    this.cartService.updateQuantity(item.book.id, -1);
  }

  // ─── Saved address toggle ─────────────────────────────────────────────────
  toggleSavedAddress(checked: boolean): void {
    this.useSavedAddress.set(checked);
    if (checked) {
      this.addressForm.patchValue(this.SAVED_ADDRESS);
    } else {
      this.addressForm.reset({ dialCode: '+91', country: 'India' });
    }
  }

  // ─── Coupon ───────────────────────────────────────────────────────────────
  onCouponInput(value: string): void {
    this.couponCode.set(value);
    this.couponMessage.set('');
  }

  applyCoupon(): void {
    const applied = this.cartService.applyCoupon(this.couponCode());
    if (applied) {
      this.couponApplied.set(true);
      this.couponMessage.set(`Coupon applied! You save ₹${this.cartService.discount()}.`);
    } else {
      this.couponApplied.set(false);
      this.couponMessage.set('Invalid coupon code. Try BOOKWORM100.');
    }
  }

  // ─── Pay Now — open PaymentModal ─────────────────────────────────────────
  openPaymentModal(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.showPaymentModal.set(true);
  }

  /** Called by PaymentModalComponent (confirmed output) when payment succeeds. */
  onPaymentConfirmed(): void {
    const items = [...this.cartService.cartItems()];
    // Snapshot items before clearing
    this.purchasedItems.set(items);

    const now = new Date();
    const deliveryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

    // Save order in history
    this.ordersService.addOrder({
      orderId,
      items,
      totalAmount: this.cartService.grandTotal(),
      orderDate: now,
      deliveryDate,
      status: 'Confirmed',
      paymentMethod: 'Credit Card',
      canCancel: true,
    });

    this.showPaymentModal.set(false);
    this.orderPlaced.set(true);
    this.showConfirmationModal.set(true);
  }

  /** Called by PaymentModalComponent (closed output) when dismissed. */
  onPaymentClosed(): void {
    this.showPaymentModal.set(false);
  }

  /** Called by OrderConfirmationModal (continueShoppingClicked output). */
  onContinueShopping(): void {
    this.showConfirmationModal.set(false);
    this.orderPlaced.set(false);
    this.router.navigate(['/']);
  }

  // ─── Form helpers ─────────────────────────────────────────────────────────
  isInvalid(field: string): boolean {
    const ctrl = this.addressForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
