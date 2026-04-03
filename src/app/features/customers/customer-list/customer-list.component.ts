import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from '../../../shared/models/customer.model';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, MatCardModule, MatTableModule, MatChipsModule, MatIconModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  displayedColumns = ['name', 'email', 'tier', 'totalOrders', 'totalSpend', 'status'];

  private destroy$ = new Subject<void>();

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customers => this.customers = customers);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTierColor(tier: Customer['tier']): string {
    const map: Record<Customer['tier'], string> = {
      standard: 'default',
      silver: '#9e9e9e',
      gold: '#ffd600',
      platinum: '#546e7a'
    };
    return map[tier];
  }
}
