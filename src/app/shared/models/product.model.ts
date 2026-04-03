export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stockQuantity: number;
  reorderPoint: number;
  supplierId: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | 'electronics'
  | 'grocery'
  | 'apparel'
  | 'home-goods'
  | 'toys'
  | 'sports';

export interface ProductFilter {
  search?: string;
  category?: ProductCategory;
  status?: Product['status'];
}
