import React from 'react';
import { ProductCosts } from '../../features/products/types';
import { calculateProductTotals, formatCurrency } from '../../features/products/calculations';

interface CostSummaryProps {
  costs: ProductCosts;
  currency: 'DOP' | 'USD';
  className?: string;
}

export const CostSummary: React.FC<CostSummaryProps> = ({
  costs,
  currency,
  className = ''
}) => {
  const totals = calculateProductTotals(costs);
  const laborCost = costs.laborHours * costs.laborRate;
  const base = costs.materials + laborCost;
  const overhead = ((costs.overheadPct ?? 0) / 100) * base;

  const breakdownItems = [
    { label: 'Materiales', amount: costs.materials },
    { label: 'Mano de obra', amount: laborCost },
    { label: 'Transporte', amount: costs.travel },
    { label: 'Servicios externos', amount: costs.services },
    ...(costs.extras ? [{ label: 'Extras', amount: costs.extras }] : []),
    ...(overhead > 0 ? [{ label: `Overhead (${costs.overheadPct}%)`, amount: overhead }] : [])
  ];

  return (
    <div className={`bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        💰 Resumen de Costos
      </h3>
      
      <div className="space-y-3 mb-4">
        {breakdownItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(item.amount, currency)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-amber-200 pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-900">Costo Total</span>
          <span className="text-base font-bold text-gray-900">
            {formatCurrency(totals.cost, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-amber-700">Precio Sugerido (30%)</span>
          <span className="text-lg font-bold text-amber-700">
            {formatCurrency(totals.priceSuggested, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};