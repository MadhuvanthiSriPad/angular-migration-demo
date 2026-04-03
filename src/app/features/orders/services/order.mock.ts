import { Order } from '../../../shared/models/order.model';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_001',
    orderNumber: 'RC-20240301-001',
    customerId: 'cust_001',
    customerName: 'Maria Garcia',
    items: [
      { productId: 'prod_001', productName: '55" 4K Smart TV', sku: 'ELEC-TV-55', quantity: 1, unitPrice: 549.99, lineTotal: 549.99 },
      { productId: 'prod_006', productName: 'Non-Slip Yoga Mat 6mm', sku: 'SPORT-YOGA-MAT', quantity: 2, unitPrice: 34.99, lineTotal: 69.98 }
    ],
    subtotal: 619.97,
    tax: 49.60,
    total: 669.57,
    status: 'completed',
    shippingAddress: { street: '123 Main St', city: 'Austin', state: 'TX', zip: '78701', country: 'US' },
    createdAt: '2024-03-01T14:22:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  },
  {
    id: 'ord_002',
    orderNumber: 'RC-20240308-002',
    customerId: 'cust_002',
    customerName: 'James Wilson',
    items: [
      { productId: 'prod_007', productName: 'Wireless Noise-Cancelling Headphones', sku: 'ELEC-BT-HEADPHONES', quantity: 1, unitPrice: 179.99, lineTotal: 179.99 }
    ],
    subtotal: 179.99,
    tax: 14.40,
    total: 194.39,
    status: 'shipped',
    shippingAddress: { street: '456 Oak Ave', city: 'Denver', state: 'CO', zip: '80203', country: 'US' },
    createdAt: '2024-03-08T09:15:00Z',
    updatedAt: '2024-03-09T08:00:00Z'
  },
  {
    id: 'ord_003',
    orderNumber: 'RC-20240310-003',
    customerId: 'cust_003',
    customerName: 'Priya Patel',
    items: [
      { productId: 'prod_003', productName: "Men's Running Shoes - Size 10", sku: 'APP-RUN-M10', quantity: 1, unitPrice: 89.99, lineTotal: 89.99 },
      { productId: 'prod_004', productName: 'Programmable Coffee Maker 12-Cup', sku: 'HOME-COFFEE-MAKER', quantity: 1, unitPrice: 49.99, lineTotal: 49.99 }
    ],
    subtotal: 139.98,
    tax: 11.20,
    total: 151.18,
    status: 'processing',
    shippingAddress: { street: '789 Pine Rd', city: 'Seattle', state: 'WA', zip: '98101', country: 'US' },
    createdAt: '2024-03-10T16:45:00Z',
    updatedAt: '2024-03-10T16:45:00Z'
  },
  {
    id: 'ord_004',
    orderNumber: 'RC-20240312-004',
    customerId: 'cust_004',
    customerName: 'David Kim',
    items: [
      { productId: 'prod_005', productName: 'LEGO City Police Station', sku: 'TOY-LEGO-CITY', quantity: 2, unitPrice: 119.99, lineTotal: 239.98 }
    ],
    subtotal: 239.98,
    tax: 19.20,
    total: 259.18,
    status: 'pending',
    shippingAddress: { street: '321 Maple Dr', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' },
    createdAt: '2024-03-12T11:30:00Z',
    updatedAt: '2024-03-12T11:30:00Z'
  },
  {
    id: 'ord_005',
    orderNumber: 'RC-20240313-005',
    customerId: 'cust_001',
    customerName: 'Maria Garcia',
    items: [
      { productId: 'prod_002', productName: 'Organic Whole Milk (1 gal)', sku: 'GROC-ORG-MILK', quantity: 4, unitPrice: 6.49, lineTotal: 25.96 }
    ],
    subtotal: 25.96,
    tax: 0,
    total: 25.96,
    status: 'completed',
    shippingAddress: { street: '123 Main St', city: 'Austin', state: 'TX', zip: '78701', country: 'US' },
    createdAt: '2024-03-13T08:00:00Z',
    updatedAt: '2024-03-14T10:00:00Z'
  },
  {
    id: 'ord_006',
    orderNumber: 'RC-20240314-006',
    customerId: 'cust_005',
    customerName: 'Sandra Lee',
    items: [
      { productId: 'prod_008', productName: 'HEPA Air Purifier — Large Room', sku: 'HOME-AIR-PURIFIER', quantity: 1, unitPrice: 199.99, lineTotal: 199.99 }
    ],
    subtotal: 199.99,
    tax: 16.00,
    total: 215.99,
    status: 'cancelled',
    shippingAddress: { street: '654 Elm St', city: 'Miami', state: 'FL', zip: '33101', country: 'US' },
    createdAt: '2024-03-14T14:00:00Z',
    updatedAt: '2024-03-15T09:00:00Z'
  }
];
