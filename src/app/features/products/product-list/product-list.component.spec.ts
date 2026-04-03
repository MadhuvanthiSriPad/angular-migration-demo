import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MOCK_PRODUCTS } from '../services/product.mock';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll', 'delete']);
    productServiceSpy.getAll.and.returnValue(of(MOCK_PRODUCTS));

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: NotificationService, useValue: { success: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceSpy.getAll).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(MOCK_PRODUCTS.length);
  });

  it('should correctly identify low-stock products', () => {
    const lowStockProduct = MOCK_PRODUCTS.find(p => p.stockQuantity <= p.reorderPoint)!;
    const inStockProduct = MOCK_PRODUCTS.find(p => p.stockQuantity > p.reorderPoint)!;

    expect(component.isLowStock(lowStockProduct)).toBeTrue();
    expect(component.isLowStock(inStockProduct)).toBeFalse();
  });

  it('should filter products by search term', (done) => {
    component.searchControl.setValue('4K');
    setTimeout(() => {
      expect(component.dataSource.filter).toBe('4k');
      done();
    }, 400);
  });
});
