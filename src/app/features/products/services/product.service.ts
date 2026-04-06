import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { delay, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { Product, ProductFilter } from '../../../shared/models/product.model';
import { StorageService } from '../../../core/services/storage.service';
import { MOCK_PRODUCTS } from './product.mock';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'rc_products';

  private _products = signal<Product[]>(this.loadFromStorage());
  products = this._products.asReadonly();
  private _products$ = toObservable(this.products);
  get products$(): Observable<Product[]> {
    return this._products$.pipe(startWith(this.products()), distinctUntilChanged());
  }

  constructor(private storage: StorageService) {}

  getAll(filter?: ProductFilter): Observable<Product[]> {
    return this.products$.pipe(
      map(products => this.applyFilter(products, filter))
    );
  }

  getById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  create(payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const product: Product = {
      ...payload,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return of(product).pipe(
      delay(300),
      tap(p => {
        const updated = [...this._products(), p];
        this.saveToStorage(updated);
        this._products.set(updated);
      })
    );
  }

  update(id: string, changes: Partial<Product>): Observable<Product> {
    const current = this._products();
    const index = current.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);

    const updated: Product = {
      ...current[index],
      ...changes,
      id,
      updatedAt: new Date().toISOString()
    };

    return of(updated).pipe(
      delay(300),
      tap(p => {
        const list = [...current];
        list[index] = p;
        this.saveToStorage(list);
        this._products.set(list);
      })
    );
  }

  delete(id: string): Observable<void> {
    return of(void 0).pipe(
      delay(300),
      tap(() => {
        const updated = this._products().filter(p => p.id !== id);
        this.saveToStorage(updated);
        this._products.set(updated);
      })
    );
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.stockQuantity <= p.reorderPoint))
    );
  }

  private applyFilter(products: Product[], filter?: ProductFilter): Product[] {
    if (!filter) return products;
    return products.filter(p => {
      const matchesSearch = !filter.search ||
        p.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        p.sku.toLowerCase().includes(filter.search.toLowerCase());
      const matchesCategory = !filter.category || p.category === filter.category;
      const matchesStatus = !filter.status || p.status === filter.status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  private loadFromStorage(): Product[] {
    return this.storage.get<Product[]>(this.STORAGE_KEY) ?? MOCK_PRODUCTS;
  }

  private saveToStorage(products: Product[]): void {
    this.storage.set(this.STORAGE_KEY, products);
  }
}
