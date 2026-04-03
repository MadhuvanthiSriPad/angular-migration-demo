import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Order, OrderStatus } from '../../../shared/models/order.model';
import { StorageService } from '../../../core/services/storage.service';
import { MOCK_ORDERS } from './order.mock';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly STORAGE_KEY = 'rc_orders';

  private ordersSubject = new BehaviorSubject<Order[]>(this.loadFromStorage());
  orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor(private storage: StorageService) {}

  getAll(): Observable<Order[]> {
    return this.orders$;
  }

  getById(id: string): Observable<Order | undefined> {
    return this.orders$.pipe(
      map(orders => orders.find(o => o.id === id))
    );
  }

  getByStatus(status: OrderStatus): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders => orders.filter(o => o.status === status))
    );
  }

  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    const current = this.ordersSubject.value;
    const index = current.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Order ${id} not found`);

    const updated: Order = {
      ...current[index],
      status,
      updatedAt: new Date().toISOString()
    };

    return of(updated).pipe(
      delay(300),
      tap(o => {
        const list = [...current];
        list[index] = o;
        this.saveToStorage(list);
        this.ordersSubject.next(list);
      })
    );
  }

  getRecentOrders(limit = 5): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders =>
        [...orders]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit)
      )
    );
  }

  getTotalRevenue(): Observable<number> {
    return this.orders$.pipe(
      map(orders =>
        orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.total, 0)
      )
    );
  }

  private loadFromStorage(): Order[] {
    return this.storage.get<Order[]>(this.STORAGE_KEY) ?? MOCK_ORDERS;
  }

  private saveToStorage(orders: Order[]): void {
    this.storage.set(this.STORAGE_KEY, orders);
  }
}
