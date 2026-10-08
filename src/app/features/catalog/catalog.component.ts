import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  BESTSELLERS,
  CATEGORIES,
  MOCK_BOOKS,
  NEW_LAUNCHES,
  RECOMMENDED,
} from '../../core/data/mock-books.data';
import { Book, BookFormat } from '../../core/models/book.model';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';

type SortOption = 'Relevance' | 'Price: Low to High' | 'Price: High to Low' | 'Rating';

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRange[] = [
  { label: 'All', min: 0, max: Infinity },
  { label: '₹0 – ₹199', min: 0, max: 199 },
  { label: '₹200 – ₹399', min: 200, max: 399 },
  { label: '₹400+', min: 400, max: Infinity },
];

const LANGUAGES = ['All', 'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'];
const FORMATS: ('All' | BookFormat)[] = ['All', 'Paperback', 'Hard Cover', 'eBook'];
const SORT_OPTIONS: SortOption[] = [
  'Relevance',
  'Price: Low to High',
  'Price: High to Low',
  'Rating',
];

/**
 * CatalogComponent — main book discovery page (screen-01-catalog.png).
 *
 * Left sidebar: category filter list.
 * Top bar:      search, language, format, price-range dropdowns + sort.
 * Main area:    three section carousels — Recommended, Bestsellers, New Launches.
 */
@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, BookCardComponent],
  templateUrl: './catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  // ─── Static reference data ────────────────────────────────────────────────
  readonly categories = CATEGORIES;
  readonly languages = LANGUAGES;
  readonly formats = FORMATS;
  readonly sortOptions = SORT_OPTIONS;
  readonly priceRanges = PRICE_RANGES;

  // ─── Filter state ─────────────────────────────────────────────────────────
  readonly selectedCategory = signal<string>('All');
  readonly searchQuery = signal<string>('');
  readonly selectedLanguage = signal<string>('All');
  readonly selectedFormat = signal<string>('All');
  readonly selectedPriceRange = signal<PriceRange>(PRICE_RANGES[0]);
  readonly selectedSort = signal<SortOption>('Relevance');

  // Internal debounce handle
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // ─── Derived / filtered lists ─────────────────────────────────────────────
  private readonly filteredAll = computed<Book[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const lang = this.selectedLanguage();
    const fmt = this.selectedFormat();
    const pr = this.selectedPriceRange();
    const sort = this.selectedSort();

    let books = MOCK_BOOKS.filter((b) => {
      const matchCat =
        cat === 'All' ||
        b.categories.some((c) => c.toLowerCase() === cat.toLowerCase());
      const matchLang = lang === 'All' || b.language === lang;
      const matchFmt = fmt === 'All' || b.format === fmt;
      const matchPrice = b.price >= pr.min && b.price <= pr.max;
      const matchQuery =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query);
      return matchCat && matchLang && matchFmt && matchPrice && matchQuery;
    });

    switch (sort) {
      case 'Price: Low to High':
        books = [...books].sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        books = [...books].sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        books = [...books].sort((a, b) => b.rating - a.rating);
        break;
    }
    return books;
  });

  /**
   * When filters are active, show one flat filtered grid.
   * When no filter is applied, show the three section carousels.
   */
  readonly isFiltering = computed<boolean>(
    () =>
      this.searchQuery().trim() !== '' ||
      this.selectedCategory() !== 'All' ||
      this.selectedLanguage() !== 'All' ||
      this.selectedFormat() !== 'All' ||
      this.selectedPriceRange().label !== 'All' ||
      this.selectedSort() !== 'Relevance',
  );

  readonly filteredBooks = computed<Book[]>(() => this.filteredAll());

  // Static section data (no filtering applied here — shown on default view)
  readonly recommended: Book[] = RECOMMENDED;
  readonly bestsellers: Book[] = BESTSELLERS;
  readonly newLaunches: Book[] = NEW_LAUNCHES;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  // ─── Event handlers ───────────────────────────────────────────────────────

  onSearchInput(value: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchQuery.set(value);
    }, 300);
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  onLanguageChange(value: string): void {
    this.selectedLanguage.set(value);
  }

  onFormatChange(value: string): void {
    this.selectedFormat.set(value);
  }

  onPriceRangeChange(label: string): void {
    const range = PRICE_RANGES.find((r) => r.label === label) ?? PRICE_RANGES[0];
    this.selectedPriceRange.set(range);
  }

  onSortChange(value: SortOption): void {
    this.selectedSort.set(value);
  }

  navigateToBook(bookId: string): void {
    this.router.navigate(['/books', bookId]);
  }
}
