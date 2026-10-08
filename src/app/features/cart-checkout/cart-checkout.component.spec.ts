import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CartCheckoutComponent } from './cart-checkout.component';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';

describe('CartCheckoutComponent', () => {
  let component: CartCheckoutComponent;
  let fixture: ComponentFixture<CartCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCheckoutComponent],
      providers: [
        provideRouter([]),
        CartService,
        OrdersService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enforce required and pattern fields for pin, phone, and email in the address form', () => {
    const form = component.addressForm;

    // Initially, form is invalid
    expect(form.valid).toBe(false);

    // Validate PIN Code
    const pinControl = form.get('pin');
    expect(pinControl).toBeTruthy();
    
    pinControl?.setValue('');
    expect(pinControl?.hasError('required')).toBe(true);

    pinControl?.setValue('12345'); // 5 digits
    expect(pinControl?.hasError('invalidPin')).toBe(true);

    pinControl?.setValue('560001'); // 6 digits
    expect(pinControl?.valid).toBe(true);

    // Validate Phone Number
    const phoneControl = form.get('phone');
    expect(phoneControl).toBeTruthy();

    phoneControl?.setValue('');
    expect(phoneControl?.hasError('required')).toBe(true);

    phoneControl?.setValue('98765'); // 5 digits
    expect(phoneControl?.hasError('invalidPhone')).toBe(true);

    phoneControl?.setValue('9876543210'); // 10 digits
    expect(phoneControl?.valid).toBe(true);

    // Validate Email Address
    const emailControl = form.get('email');
    expect(emailControl).toBeTruthy();

    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBe(true);

    emailControl?.setValue('not-an-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should trigger payment modal successfully when Pay Now is clicked and address form is valid', () => {
    // Initially, payment modal is hidden
    expect(component.showPaymentModal()).toBe(false);

    // Click 'Pay Now' on invalid form
    component.openPaymentModal();
    expect(component.showPaymentModal()).toBe(false); // remains false

    // Fill form with valid details
    component.addressForm.patchValue({
      firstName: 'Ravi',
      lastName: 'Kumar',
      addressLine: '42, MG Road, Bengaluru',
      email: 'ravi@example.com',
      city: 'Bengaluru',
      pin: '560001',
      dialCode: '+91',
      phone: '9876543210',
      state: 'Karnataka',
      country: 'India',
    });

    expect(component.addressForm.valid).toBe(true);

    // Click 'Pay Now' with valid form
    component.openPaymentModal();
    expect(component.showPaymentModal()).toBe(true); // triggers and opens modal successfully!
  });
});
