import { Customer } from '../../../shared/models/customer.model';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_001',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '512-555-0101',
    tier: 'gold',
    totalOrders: 24,
    totalSpend: 3842.50,
    status: 'active',
    joinedAt: '2021-04-15T00:00:00Z'
  },
  {
    id: 'cust_002',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '303-555-0142',
    tier: 'silver',
    totalOrders: 11,
    totalSpend: 1240.99,
    status: 'active',
    joinedAt: '2022-01-20T00:00:00Z'
  },
  {
    id: 'cust_003',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@email.com',
    phone: '206-555-0183',
    tier: 'standard',
    totalOrders: 4,
    totalSpend: 389.70,
    status: 'active',
    joinedAt: '2023-06-10T00:00:00Z'
  },
  {
    id: 'cust_004',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@email.com',
    phone: '312-555-0217',
    tier: 'platinum',
    totalOrders: 68,
    totalSpend: 12450.00,
    status: 'active',
    joinedAt: '2020-09-01T00:00:00Z'
  },
  {
    id: 'cust_005',
    firstName: 'Sandra',
    lastName: 'Lee',
    email: 'sandra.lee@email.com',
    phone: '305-555-0099',
    tier: 'standard',
    totalOrders: 2,
    totalSpend: 215.99,
    status: 'inactive',
    joinedAt: '2023-12-01T00:00:00Z'
  },
  {
    id: 'cust_006',
    firstName: 'Carlos',
    lastName: 'Mendez',
    email: 'carlos.mendez@email.com',
    phone: '415-555-0310',
    tier: 'gold',
    totalOrders: 18,
    totalSpend: 2910.45,
    status: 'active',
    joinedAt: '2021-11-15T00:00:00Z'
  }
];
