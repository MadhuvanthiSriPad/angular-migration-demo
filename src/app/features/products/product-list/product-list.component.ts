import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Product, ProductCategory } from '../../../shared/models/product.model';
import { ProductService } from '../services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  displayedColumns = ['sku', 'name', 'category', 'price', 'stockQuantity', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  searchControl = new FormControl('');
  categoryControl = new FormControl<ProductCategory | ''>('');

  categories: ProductCategory[] = ['electronics', 'grocery', 'apparel', 'home-goods', 'toys', 'sports'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.dataSource.data = products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.dataSource.filter = (value ?? '').trim().toLowerCase();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEdit(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  onDelete(product: Product): void {
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.productService.delete(product.id).subscribe(() => {
      this.notificationService.success(`"${product.name}" deleted.`);
    });
  }

  isLowStock(product: Product): boolean {
    return product.stockQuantity <= product.reorderPoint;
  }
}
