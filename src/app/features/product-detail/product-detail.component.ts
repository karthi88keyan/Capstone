import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MOCK_BOOKS, MOCK_REVIEWS, RECOMMENDED } from '../../core/data/mock-books.data';
import { Book } from '../../core/models/book.model';
import { Review } from '../../core/models/review.model';
import { CartService } from '../../core/services/cart.service';

/**
 * ProductDetailComponent — book detail page (screen-02-product-detail.png).
 *
 * Three-column layout:
 *  Left   — dual book covers (front + back)
 *  Centre — title, author, synopsis, metadata, cart/wishlist, author bio, reviews
 *  Right  — Related Reads sidebar
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);

  // ─── Book data ────────────────────────────────────────────────────────────
  readonly book = signal<Book | null>(null);
  readonly reviews = signal<Review[]>([]);

  /** Related reads — fixed to Recommended books (excluding current book). */
  readonly relatedReads = computed<Book[]>(() => {
    const current = this.book();
    return RECOMMENDED.filter((b) => b.id !== current?.id).slice(0, 3);
  });

  // ─── Review form state ────────────────────────────────────────────────────
  readonly reviewText = signal<string>('');
  readonly reviewRating = signal<number>(0);
  /** Hover position for the interactive star selector. */
  readonly hoverRating = signal<number>(0);

  readonly charCount = computed(() => this.reviewText().length);
  readonly MAX_CHARS = 100;

  // ─── Wishlist (local signal — no persistence needed for this screen) ──────
  readonly inWishlist = signal<boolean>(false);

  // ─── Star array helpers ───────────────────────────────────────────────────
  readonly STARS = [1, 2, 3, 4, 5] as const;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? 'joy-of-minimalism';
      const found = MOCK_BOOKS.find((b) => b.id === id) ?? MOCK_BOOKS[6];
      this.book.set(found);
      this.reviews.set(MOCK_REVIEWS[found.id] ?? []);
    });
  }

  // ─── Cart / wishlist ──────────────────────────────────────────────────────
  addToCart(): void {
    const b = this.book();
    if (b) this.cartService.addToCart(b);
  }

  addRelatedToCart(book: Book): void {
    this.cartService.addToCart(book);
  }

  toggleWishlist(): void {
    this.inWishlist.update((v) => !v);
  }

  // ─── Review form ──────────────────────────────────────────────────────────
  onReviewInput(value: string): void {
    if (value.length <= this.MAX_CHARS) this.reviewText.set(value);
  }

  setRating(star: number): void {
    this.reviewRating.set(star);
  }

  setHover(star: number): void {
    this.hoverRating.set(star);
  }

  clearHover(): void {
    this.hoverRating.set(0);
  }

  submitReview(): void {
    const text = this.reviewText().trim();
    if (!text || this.reviewRating() === 0) return;
    const newReview: Review = {
      id: `r-${Date.now()}`,
      reviewerName: 'You',
      rating: this.reviewRating(),
      comment: text,
      date: new Date().toISOString().slice(0, 10),
    };
    this.reviews.update((prev) => [newReview, ...prev]);
    this.reviewText.set('');
    this.reviewRating.set(0);
  }

  // ─── Star rendering helpers ───────────────────────────────────────────────
  /** Returns true if star position should be filled for a given rating value. */
  isFilled(star: number, rating: number): boolean {
    return star <= Math.round(rating);
  }

  activeStar(star: number): boolean {
    const active = this.hoverRating() || this.reviewRating();
    return star <= active;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
