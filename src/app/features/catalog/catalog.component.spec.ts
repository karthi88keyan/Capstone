import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CatalogComponent } from './catalog.component';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default filter selections', () => {
    expect(component.selectedCategory()).toBe('All');
    expect(component.searchQuery()).toBe('');
    expect(component.selectedLanguage()).toBe('All');
    expect(component.selectedFormat()).toBe('All');
    expect(component.selectedSort()).toBe('Relevance');
  });

  it('should update selectedCategory when selectCategory is called', () => {
    component.selectCategory('Fiction');
    expect(component.selectedCategory()).toBe('Fiction');
  });

  it('should update selectedLanguage when onLanguageChange is called', () => {
    component.onLanguageChange('English');
    expect(component.selectedLanguage()).toBe('English');
  });

  it('should update selectedFormat when onFormatChange is called', () => {
    component.onFormatChange('Paperback');
    expect(component.selectedFormat()).toBe('Paperback');
  });
});
