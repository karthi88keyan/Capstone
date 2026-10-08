import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OrderHistoryComponent } from './order-history.component';
import { OrdersService } from '../../core/services/orders.service';
import { CartService } from '../../core/services/cart.service';
import { Book } from '../../core/models';

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;
  let ordersService: OrdersService;
  let cartService: CartService;

  const mockBook: Book = {
    id: 'art-of-focus',
    title: 'The Art of Focus',
    author: 'Arjun Patel',
    description: 'Practical guide to mastering focus & boosting productivity every day.',
    price: 399,
    originalPrice: 499,
    deliveryDateTag: 'Delivery by Mon, 21 Jul',
    categories: ['Non-fiction', 'Self Help'],
    format: 'Paperback',
    language: 'English',
    rating: 4.5,
    reviewCount: 1240,
    sellsCount: 8900,
    coverImage: '',
    publisher: 'Mindful Press',
    authorBio: 'Bio',
    authorPhoto: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderHistoryComponent],
      providers: [
        provideRouter([]),
        OrdersService,
        CartService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    ordersService = TestBed.inject(OrdersService);
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if orders can be cancelled', () => {
    const now = new Date();
    
    // Eligible (recent, active status)
    const eligibleOrder = {
      orderId: 'ORD-12345',
      items: [],
      totalAmount: 100,
      orderDate: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      deliveryDate: now,
      status: 'Confirmed' as any,
      paymentMethod: 'UPI' as any,
      canCancel: true,
    };
    expect(component.isEligibleForCancellation(eligibleOrder)).toBe(true);

    // Ineligible because already Cancelled
    const cancelledOrder = { ...eligibleOrder, status: 'Cancelled' as any };
    expect(component.isEligibleForCancellation(cancelledOrder)).toBe(false);

    // Ineligible because age is > 48 hours
    const oldOrder = { ...eligibleOrder, orderDate: new Date(now.getTime() - 50 * 60 * 60 * 1000) }; // 50 hours ago
    expect(component.isEligibleForCancellation(oldOrder)).toBe(false);
  });

  it('should trigger cancelOrder inside OrdersService', () => {
    spyOn(ordersService, 'cancelOrder');
    component.cancelOrder('ORD-89472');
    expect(ordersService.cancelOrder).toHaveBeenCalledWith('ORD-89472');
    expect(component.notification()).toContain('cancelled');
  });

  it('should buy book again by pushing it to CartService', () => {
    spyOn(cartService, 'addToCart');
    component.buyAgain(mockBook);
    expect(cartService.addToCart).toHaveBeenCalledWith(mockBook);
    expect(component.notification()).toContain('added to your cart');
  });
});
