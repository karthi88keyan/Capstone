import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'book/:id', loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart-checkout/cart-checkout.component').then(
        (m) => m.CartCheckoutComponent,
      ),
  },
  { path: 'orders', loadComponent: () => import('./features/order-history/order-history.component').then(m => m.OrderHistoryComponent) }
];
