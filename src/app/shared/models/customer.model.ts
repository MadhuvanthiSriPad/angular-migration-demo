export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tier: CustomerTier;
  totalOrders: number;
  totalSpend: number;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export type CustomerTier = 'standard' | 'silver' | 'gold' | 'platinum';

export interface CustomerSummary {
  id: string;
  fullName: string;
  email: string;
  tier: CustomerTier;
  totalOrders: number;
}
