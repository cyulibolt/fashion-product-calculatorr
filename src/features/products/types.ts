export type Currency = 'DOP' | 'USD';
export type ProductStatus = 'draft' | 'active';

export interface ProductCosts {
  materials: number;
  laborHours: number;
  laborRate: number;
  travel: number;
  services: number;
  extras?: number;
  overheadPct?: number;
}

export interface ProductTotals {
  cost: number;
  priceSuggested: number;
  marginPct: number;
}

export interface ProductImage {
  id: string;
  url: string;
  caption?: string;
  isCover?: boolean;
  sort: number;
}

export interface Product {
  id: string;
  code: string;
  title: string;
  clientName?: string;
  status: ProductStatus;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  costs: ProductCosts;
  totals: ProductTotals;
  gallery: ProductImage[];
  notes?: string;
}

export interface CreateProductRequest {
  title: string;
  clientName?: string;
  currency: Currency;
  costs: ProductCosts;
  notes?: string;
}