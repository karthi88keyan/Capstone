import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { Book } from '../models';

describe('CartService', () => {
  let service: CartService;

  const mockBook1: Book = {
    id: 'book-1',
    title: 'Test Book 1',
    author: 'Author 1',
    description: 'Desc 1',
    price: 500,
    originalPrice: 600,
    deliveryDateTag: 'Delivers tomorrow',
    categories: ['Fiction'],
    format: 'Paperback',
    language: 'English',
    rating: 4.5,
    reviewCount: 10,
    sellsCount: 100,
    coverImage: '',
    publisher: 'Publisher 1',
    authorBio: 'Bio 1',
    authorPhoto: '',
  };

  const mockBook2: Book = {
    id: 'book-2',
    title: 'Test Book 2',
    author: 'Author 2',
    description: 'Desc 2',
    price: 1000,
    originalPrice: 1200,
    deliveryDateTag: 'Delivers in 3 days',
    categories: ['Non-fiction'],
    format: 'Hard Cover',
    language: 'English',
    rating: 4.8,
    reviewCount: 20,
    sellsCount: 200,
    coverImage: '',
    publisher: 'Publisher 2',
    authorBio: 'Bio 2',
    authorPhoto: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 1: Verify adding items properly updates the cart items signal and recalculates subtotal and tax.
  it('should properly update the cart items signal and recalculate subtotal and tax when items are added', () => {
    expect(service.cartItems().length).toBe(0);
    expect(service.subtotal()).toBe(0);
    expect(service.tax()).toBe(0);

    // Add first item
    service.addToCart(mockBook1);
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].book.id).toBe('book-1');
    expect(service.cartItems()[0].quantity).toBe(1);
    expect(service.subtotal()).toBe(500);
    expect(service.tax()).toBe(60); // 12% of 500 is 60

    // Add second item
    service.addToCart(mockBook2);
    expect(service.cartItems().length).toBe(2);
    expect(service.subtotal()).toBe(1500); // 500 + 1000
    expect(service.tax()).toBe(180); // 12% of 1500 is 180

    // Add mockBook1 again to increment quantity
    service.addToCart(mockBook1);
    expect(service.cartItems().length).toBe(2);
    expect(service.cartItems().find(item => item.book.id === 'book-1')?.quantity).toBe(2);
    expect(service.subtotal()).toBe(2000); // (500 * 2) + 1000 = 2000
    expect(service.tax()).toBe(240); // 12% of 2000 is 240
  });

  // Test 2: Verify grandTotal computes discounts correctly after applyCoupon('SAVE100').
  it('should correctly compute discounts and grandTotal after applying coupon SAVE100', () => {
    // Add mockBook2 (price ₹1000)
    service.addToCart(mockBook2);
    expect(service.subtotal()).toBe(1000);
    expect(service.tax()).toBe(120);

    // Apply coupon
    const applied = service.applyCoupon('SAVE100');
    expect(applied).toBe(true);
    expect(service.discount()).toBe(100);

    // Verify grandTotal: subtotal (1000) + tax (120) - discount (100) = 1020
    expect(service.grandTotal()).toBe(1020);
  });
});
