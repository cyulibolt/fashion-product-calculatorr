import React from 'react';
import { Package, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Product } from '../products/types';
import { formatCurrency } from '../products/calculations';

interface DashboardStatsProps {
  products: Product[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ products }) => {
  const totalProducts = products.length;
  const totalCost = products.reduce((sum, product) => sum + product.totals.cost, 0);
  const totalRevenue = products.reduce((sum, product) => sum + product.totals.priceSuggested, 0);
  const avgMargin = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

  const stats = [
    {
      title: 'Productos Este Mes',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Costo Acumulado',
      value: formatCurrency(totalCost, 'DOP'),
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Precio Sugerido Total',
      value: formatCurrency(totalRevenue, 'DOP'),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Margen Promedio',
      value: `${avgMargin.toFixed(1)}%`,
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 transition-transform hover:scale-105`}>
            <div className="flex items-center">
              <div className={`${stat.color} ${stat.bgColor} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};