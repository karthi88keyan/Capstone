import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { BookCardComponent } from './book-card.component';
import { CartService } from '../../../core/services/cart.service';
import { Book } from '../../../core/models/book.model';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;
  let cartService: CartService;
  let router: Router;

  const mockBook: Book = {
    id: 'test-book',
    title: 'Visual Testing Guide',
    author: 'Jane Doe',
    description: 'A comprehensive visual guide.',
    price: 499,
    originalPrice: 599,
    deliveryDateTag: 'Delivers on Friday',
    categories: ['Education', 'Tech'],
    format: 'Hard Cover',
    language: 'English',
    rating: 4.9,
    reviewCount: 45,
    sellsCount: 1200,
    coverImage: '',
    publisher: 'Tech Books',
    authorBio: 'Bio of Jane',
    authorPhoto: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent],
      providers: [
        provideRouter([]),
        CartService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    router = TestBed.inject(Router);

    // Set required input
    fixture.componentRef.setInput('book', mockBook);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read inputs and return correct book details', () => {
    expect(component.book()).toBe(mockBook);
    expect(component.book().id).toBe('test-book');
    expect(component.book().title).toBe('Visual Testing Guide');
  });

  it('should navigate to detail page when navigateToDetail is called', () => {
    spyOn(router, 'navigate');
    component.navigateToDetail();
    expect(router.navigate).toHaveBeenCalledWith(['/book', 'test-book']);
  });

  it('should add book to CartService and stop propagation on addToCart', () => {
    spyOn(cartService, 'addToCart');
    const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
    
    component.addToCart(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(cartService.addToCart).toHaveBeenCalledWith(mockBook);
  });
});
