import { ProductCosts, ProductTotals } from './types';

export function calculateProductTotals(costs: ProductCosts): ProductTotals {
  const laborCost = costs.laborHours * costs.laborRate;
  const base = costs.materials + laborCost;
  const overhead = ((costs.overheadPct ?? 0) / 100) * base;
  
  const cost = base + costs.travel + costs.services + (costs.extras ?? 0) + overhead;
  const marginPct = 0.30; // Fixed 30% margin for MVP
  const priceSuggested = cost / (1 - marginPct);

  return {
    cost: Math.round(cost * 100) / 100,
    priceSuggested: Math.round(priceSuggested * 100) / 100,
    marginPct
  };
}

export function formatCurrency(amount: number, currency: 'DOP' | 'USD'): string {
  const symbol = currency === 'DOP' ? 'RD$' : '$';
  return `${symbol} ${amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;
}

export function generateProductCode(): string {
  const prefix = 'FP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}