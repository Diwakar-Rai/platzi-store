import { Injectable, signal, computed } from '@angular/core';

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
    const items = this._items();

    const existing = items.find((p) => p.id === product.id);

    if (existing) {
      this.updateQuantity(product.id, existing.quantity + 1);
    } else {
      this._items.set([...items, { ...product, quantity: 1 }]);
      this.persist();
    }
  }

  increment(productId: number) {
    const item = this._items().find((p) => p.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrement(productId: number) {
    const item = this._items().find((p) => p.id === productId);
    if (!item) return;

    if (item.quantity === 1) {
      this.removeFromCart(productId);
    } else {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  private updateQuantity(productId: number, quantity: number) {
    const updated = this._items().map((item) =>
      item.id === productId ? { ...item, quantity } : item,
    );

    this._items.set(updated);
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
    localStorage.setItem('cart', JSON.stringify(this._items()));
  }
}
