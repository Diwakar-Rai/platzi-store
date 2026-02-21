import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _items = signal<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  items = computed(() => this._items());
  totalItems = computed(() => this._items().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() =>
    this._items().reduce((acc, item) => acc + item.price * item.quantity, 0),
  );

  addToCart(product: any) {
    const existing = this._items().find((p) => p.id === product.id);
    if (existing) {
      existing.quantity++;
      this._items.set([...this._items()]);
    } else {
      this._items.set([...this._items(), { ...product, quantity: 1 }]);
    }
    this.persist();
  }

  removeFromCart(productId: number) {
    this._items.set(this._items().filter((p) => p.id !== productId));
    this.persist();
  }
  clearCart() {
    this._items.set([]);
    this.persist();
  }

  private persist() {
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }
}
