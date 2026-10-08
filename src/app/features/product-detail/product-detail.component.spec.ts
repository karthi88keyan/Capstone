import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductDetailComponent } from './product-detail.component';
import { CartService } from '../../core/services/cart.service';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => 'art-of-focus',
            }),
            snapshot: {
              paramMap: {
                get: (key: string) => 'art-of-focus',
              },
            },
          },
        },
        CartService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct book based on route id', () => {
    const b = component.book();
    expect(b).toBeTruthy();
    expect(b?.id).toBe('art-of-focus');
    expect(b?.title).toBe('The Art of Focus');
  });

  it('should add the current book to the cart', () => {
    spyOn(cartService, 'addToCart');
    component.addToCart();
    expect(cartService.addToCart).toHaveBeenCalledWith(component.book()!);
  });

  it('should toggle wishlist status', () => {
    expect(component.inWishlist()).toBe(false);
    component.toggleWishlist();
    expect(component.inWishlist()).toBe(true);
    component.toggleWishlist();
    expect(component.inWishlist()).toBe(false);
  });

  it('should submit a valid review', () => {
    const initialCount = component.reviews().length;
    component.onReviewInput('This is an awesome book, highly recommended!');
    component.setRating(5);
    
    component.submitReview();
    
    expect(component.reviews().length).toBe(initialCount + 1);
    expect(component.reviews()[0].comment).toBe('This is an awesome book, highly recommended!');
    expect(component.reviews()[0].rating).toBe(5);
    expect(component.reviewText()).toBe(''); // should reset form after successful submit
  });
});
