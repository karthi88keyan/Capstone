import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OrderConfirmationModalComponent } from './order-confirmation-modal.component';
import { CartService } from '../../../core/services/cart.service';

describe('OrderConfirmationModalComponent', () => {
  let component: OrderConfirmationModalComponent;
  let fixture: ComponentFixture<OrderConfirmationModalComponent>;
  let cartService: CartService;

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
      imports: [OrderConfirmationModalComponent],
      providers: [provideRouter([]), CartService],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationModalComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear cart and emit click event on continueShopping()', () => {
    let emitted = false;
    component.continueShoppingClicked.subscribe(() => {
      emitted = true;
    });

    spyOn(cartService, 'clearCart');
    const dialogEl = (component as any).dialogRef().nativeElement;
    spyOn(dialogEl, 'close');

    component.continueShopping();

    expect(cartService.clearCart).toHaveBeenCalled();
    expect(dialogEl.close).toHaveBeenCalled();
    expect(emitted).toBe(true);
  });
});
