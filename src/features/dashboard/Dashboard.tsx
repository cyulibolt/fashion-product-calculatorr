import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Package, DollarSign } from 'lucide-react';
import { useProductsStore } from '../products/useProductsStore';
import { formatCurrency } from '../products/calculations';
import { DashboardStats } from './DashboardStats';

export const Dashboard: React.FC = () => {
  const { products, loadProducts } = useProductsStore();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const thisMonth = products.filter(product => {
    const productDate = new Date(product.createdAt);
    const now = new Date();
    return productDate.getMonth() === now.getMonth() && 
           productDate.getFullYear() === now.getFullYear();
  });

  const recentProducts = products.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fashion Studio</h1>
              <p className="text-gray-600 mt-1">Gestión de costos de productos</p>
            </div>
            <Link to="/products/new">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center shadow-md hover:shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Producto
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <DashboardStats products={thisMonth} />

        {/* Recent Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Productos Recientes</h2>
            <Link to="/products" className="text-amber-600 hover:text-amber-700 font-medium">
              Ver todos →
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos aún</h3>
              <p className="text-gray-600 mb-6">Comienza creando tu primer producto</p>
              <Link to="/products/new">
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Crear Producto
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {recentProducts.map((product) => {
                const coverImage = product.gallery.find(img => img.isCover) || product.gallery[0];
                
                return (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6">
                      <div className="flex items-center space-x-4">
                        {coverImage && (
                          <img
                            src={coverImage.url}
                            alt={product.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {product.code}
                            </span>
                          </div>
                          {product.clientName && (
                            <p className="text-sm text-gray-600 mb-2">{product.clientName}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">
                              Costo: <span className="font-medium">{formatCurrency(product.totals.cost, product.currency)}</span>
                            </span>
                            <span className="text-amber-600">
                              Precio: <span className="font-medium">{formatCurrency(product.totals.priceSuggested, product.currency)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString('es-DO')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};