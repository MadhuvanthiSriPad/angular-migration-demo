import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../../../shared/models/customer.model';
import { StorageService } from '../../../core/services/storage.service';
import { MOCK_CUSTOMERS } from './customer.mock';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly STORAGE_KEY = 'rc_customers';

  private customersSubject = new BehaviorSubject<Customer[]>(this.loadFromStorage());
  customers$: Observable<Customer[]> = this.customersSubject.asObservable();

  constructor(private storage: StorageService) {}

  getAll(): Observable<Customer[]> {
    return this.customers$;
  }

  getById(id: string): Observable<Customer | undefined> {
    return this.customers$.pipe(
      map(customers => customers.find(c => c.id === id))
    );
  }

  getActiveCount(): Observable<number> {
    return this.customers$.pipe(
      map(customers => customers.filter(c => c.status === 'active').length)
    );
  }

  getTopCustomers(limit = 5): Observable<Customer[]> {
    return this.customers$.pipe(
      map(customers =>
        [...customers]
          .sort((a, b) => b.totalSpend - a.totalSpend)
          .slice(0, limit)
      )
    );
  }

  private loadFromStorage(): Customer[] {
    return this.storage.get<Customer[]>(this.STORAGE_KEY) ?? MOCK_CUSTOMERS;
  }
}
