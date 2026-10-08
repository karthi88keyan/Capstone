import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { CartService } from '../../../core/services/cart.service';

export type PaymentTab = 'Credit Card' | 'Debit card' | 'UPI' | 'Wallet';

const TABS: PaymentTab[] = ['Credit Card', 'Debit card', 'UPI', 'Wallet'];

/** Luhn-check for a 16-digit card number (stripped of spaces/dashes). */
function cardNumberValidator(c: AbstractControl): ValidationErrors | null {
  const raw = (c.value as string).replace(/[\s\-]/g, '');
  if (!/^\d{16}$/.test(raw)) return { invalidCard: true };
  // Luhn algorithm
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let d = parseInt(raw[15 - i], 10);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0 ? null : { invalidCard: true };
}

function cvvValidator(c: AbstractControl): ValidationErrors | null {
  return /^\d{3,4}$/.test(c.value) ? null : { invalidCvv: true };
}

function expiryValidator(c: AbstractControl): ValidationErrors | null {
  if (!/^\d{2}\/\d{4}$/.test(c.value)) return { invalidExpiry: true };
  const [mm, yyyy] = c.value.split('/').map(Number);
  if (mm < 1 || mm > 12) return { invalidExpiry: true };
  const exp = new Date(yyyy, mm - 1, 1);
  return exp > new Date() ? null : { invalidExpiry: true };
}

/**
 * PaymentModalComponent — screen-04-payment-modal.png.
 *
 * Rendered as a native <dialog> element for backdrop + focus-trap support.
 * Open/close is driven by the `open` input signal; emits `confirmed` when
 * payment completes and `closed` when the user dismisses without paying.
 */
@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './payment-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentModalComponent implements OnInit, OnDestroy {
  // ─── Inputs / outputs ─────────────────────────────────────────────────────
  /** Payable amount in INR displayed in the header. */
  readonly payableAmount = input<number>(0);
  /** Emit when payment is confirmed — parent should show OrderConfirmation. */
  readonly confirmed = output<void>();
  /** Emit when dialog is dismissed without payment. */
  readonly closed = output<void>();

  // ─── Dialog element ref ───────────────────────────────────────────────────
  private readonly dialogRef =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  // ─── Injected services ────────────────────────────────────────────────────
  protected readonly cartService = inject(CartService);
  private readonly fb = inject(FormBuilder);

  // ─── Tab state ────────────────────────────────────────────────────────────
  readonly tabs = TABS;
  readonly activeTab = signal<PaymentTab>('Credit Card');

  // ─── Loading / processing state ───────────────────────────────────────────
  readonly processing = signal<boolean>(false);

  // ─── Card form ────────────────────────────────────────────────────────────
  readonly cardForm = this.fb.group({
    cardNumber: ['', [Validators.required, cardNumberValidator]],
    nameOnCard: ['', [Validators.required, Validators.minLength(2)]],
    cvv:        ['', [Validators.required, cvvValidator]],
    expiry:     ['', [Validators.required, expiryValidator]],
  });

  /** Formatted card number with XXXX-XXXX-XXXX-XXXX masking. */
  readonly maskedCardNumber = computed(() => {
    const raw = (this.cardForm.get('cardNumber')?.value ?? '') as string;
    return raw.replace(/[\s\-]/g, '').replace(/(.{4})/g, '$1-').replace(/-$/, '');
  });

  // ─── UPI form ─────────────────────────────────────────────────────────────
  readonly upiForm = this.fb.group({
    upiId: ['', [Validators.required, Validators.pattern(/^[\w.\-]+@[\w]+$/)]],
  });

  // ─── Wallet form ──────────────────────────────────────────────────────────
  readonly walletForm = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  });

  ngOnInit(): void {
    // Open the native dialog immediately on mount
    const el = this.dialogRef().nativeElement;
    el.showModal();
    // Close on native backdrop click (click outside <dialog> box)
    el.addEventListener('click', this.onBackdropClick);
  }

  ngOnDestroy(): void {
    const el = this.dialogRef().nativeElement;
    el.removeEventListener('click', this.onBackdropClick);
  }

  // ─── Event handlers ───────────────────────────────────────────────────────
  selectTab(tab: PaymentTab): void {
    this.activeTab.set(tab);
  }

  onCardNumberInput(value: string): void {
    // Allow only digits, auto-insert dashes every 4 chars
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1-').replace(/-$/, '');
    this.cardForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
  }

  onExpiryInput(value: string): void {
    // Auto-insert slash after MM
    const clean = value.replace(/\D/g, '').slice(0, 6);
    const formatted = clean.length > 2
      ? clean.slice(0, 2) + '/' + clean.slice(2)
      : clean;
    this.cardForm.get('expiry')?.setValue(formatted, { emitEvent: false });
  }

  pay(): void {
    const activeForm = this.activeFormGroup();
    if (!activeForm || activeForm.invalid) {
      activeForm?.markAllAsTouched();
      return;
    }
    this.processing.set(true);
    // Simulate 1.5 s network delay
    setTimeout(() => {
      this.processing.set(false);
      this.dialogRef().nativeElement.close();
      this.confirmed.emit();
    }, 1500);
  }

  dismiss(): void {
    this.dialogRef().nativeElement.close();
    this.closed.emit();
  }

  isInvalid(field: string): boolean {
    const ctrl = this.cardForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  // ─── Private helpers ──────────────────────────────────────────────────────
  private activeFormGroup() {
    switch (this.activeTab()) {
      case 'Credit Card':
      case 'Debit card': return this.cardForm;
      case 'UPI':        return this.upiForm;
      case 'Wallet':     return this.walletForm;
    }
  }

  private readonly onBackdropClick = (e: MouseEvent): void => {
    const rect = this.dialogRef().nativeElement.getBoundingClientRect();
    const outside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom;
    if (outside) this.dismiss();
  };
}
