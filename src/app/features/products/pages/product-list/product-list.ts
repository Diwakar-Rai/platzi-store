import { Component, computed, inject, signal } from '@angular/core';
import { Product } from '../../services/product';
import { Loader } from '../../../../shared/components/loader/loader';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { ProductCard } from '../../components/product-card/product-card';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [Loader, ErrorMessage, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(Product);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  queryParams = toSignal(this.activeRoute.queryParams, { initialValue: {} as Params });
  loading = signal(true);
  error = signal(false);
  products = signal<any[]>([]);
  limit = computed(() => Number(this.queryParams()['limit'] ?? 12));
  offset = computed(() => Number(this.queryParams()['offset'] ?? 0));
  title = computed(() => this.queryParams()['title'] ?? '');
  priceMin = computed(() =>
    this.queryParams()['price_min'] ? Number(this.queryParams()['price_min']) : null,
  );
  priceMax = computed(() =>
    this.queryParams()['price_max'] ? Number(this.queryParams()['price_max']) : null,
  );
  constructor() {
    effect(() => {
      const params = this.activeRoute.snapshot.queryParams;

      const limit = Number(params['limit'] ?? 12);
      const offset = Number(params['offset'] ?? 0);
      const title = params['title'] ?? '';
      const priceMin = params['price_min'] ? Number(params['price_min']) : undefined;
      const priceMax = params['price_max'] ? Number(params['price_max']) : undefined;

      this.loadProducts({ limit, offset, title, priceMin, priceMax });
    });
  }

  loadProducts(params: {
    limit: number;
    offset: number;
    title?: string;
    priceMin?: number;
    priceMax?: number;
  }) {
    this.loading.set(true);

    this.productService
      .getProducts({
        limit: params.limit,
        offset: params.offset,
        title: params.title,
        price_min: params.priceMin,
        price_max: params.priceMax,
      })
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
  applyFilters(
    searchInput: HTMLInputElement,
    minInput: HTMLInputElement,
    maxInput: HTMLInputElement,
  ) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        title: searchInput.value || null,
        price_min: minInput.value || null,
        price_max: maxInput.value || null,
        offset: 0,
      },
      queryParamsHandling: 'merge',
    });
  }
  nextPage() {
    const current = this.activeRoute.snapshot.queryParams;
    const limit = Number(current['limit'] ?? 12);
    const offset = Number(current['offset'] ?? 0);

    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        ...current,
        offset: offset + limit,
        limit,
      },
      queryParamsHandling: 'merge',
    });
  }

  previousPage() {
    const current = this.activeRoute.snapshot.queryParams;
    const limit = Number(current['limit'] ?? 12);
    const offset = Number(current['offset'] ?? 0);

    if (offset === 0) return;

    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        ...current,
        offset: offset - limit,
        limit,
      },
      queryParamsHandling: 'merge',
    });
  }
}
