import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModalComponent, PaymentTab } from './payment-modal.component';
import { CartService } from '../../../core/services/cart.service';

describe('PaymentModalComponent', () => {
  let component: PaymentModalComponent;
  let fixture: ComponentFixture<PaymentModalComponent>;

  beforeAll(() => {
    // Add stub methods for native HTMLDialogElement if they do not exist in test runner
    if (!HTMLDialogElement.prototype.showModal) {
      HTMLDialogElement.prototype.showModal = function() {};
    }
    if (!HTMLDialogElement.prototype.close) {
      HTMLDialogElement.prototype.close = function() {};
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentModalComponent],
      providers: [CartService],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial active tab as Credit Card', () => {
    expect(component.activeTab()).toBe('Credit Card');
  });

  it('should switch active tab when selectTab is called', () => {
    component.selectTab('UPI');
    expect(component.activeTab()).toBe('UPI');
    
    component.selectTab('Wallet');
    expect(component.activeTab()).toBe('Wallet');
  });

  it('should validate UPI form correctly', () => {
    component.selectTab('UPI');
    const form = component.upiForm;
    const upiControl = form.get('upiId');

    expect(form.valid).toBe(false);

    upiControl?.setValue('invalid_upi');
    expect(form.valid).toBe(false);

    upiControl?.setValue('john.doe@okaxis');
    expect(form.valid).toBe(true);
  });

  it('should validate wallet form correctly', () => {
    component.selectTab('Wallet');
    const form = component.walletForm;
    const mobileControl = form.get('mobile');

    expect(form.valid).toBe(false);

    mobileControl?.setValue('98765'); // 5 digits
    expect(form.valid).toBe(false);

    mobileControl?.setValue('9876543210'); // 10 digits
    expect(form.valid).toBe(true);
  });

  it('should emit closed output and close dialog when dismissed', () => {
    let emitted = false;
    component.closed.subscribe(() => {
      emitted = true;
    });

    const dialogEl = (component as any).dialogRef().nativeElement;
    spyOn(dialogEl, 'close');

    component.dismiss();

    expect(dialogEl.close).toHaveBeenCalled();
    expect(emitted).toBe(true);
  });
});
