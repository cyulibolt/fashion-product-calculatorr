import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Package } from 'lucide-react';
import { useProductsStore } from './useProductsStore';
import { formatCurrency } from './calculations';

export const ProductList: React.FC = () => {
  const { products, loadProducts, loading } = useProductsStore();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
              <p className="text-gray-600">{products.length} productos creados</p>
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
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay productos aún</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primer producto de moda</p>
            <Link to="/products/new">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Crear Primer Producto
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => {
              const coverImage = product.gallery.find(img => img.isCover) || product.gallery[0];
              
              return (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6">
                    <div className="flex items-center space-x-6">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        {coverImage ? (
                          <img
                            src={coverImage.url}
                            alt={product.title}
                            className="w-20 h-20 rounded-lg object-cover shadow-sm"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.title}</h3>
                          <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-mono">
                            {product.code}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.status === 'active' ? 'Activo' : 'Borrador'}
                          </span>
                        </div>
                        
                        {product.clientName && (
                          <p className="text-gray-600 mb-3">Cliente: {product.clientName}</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Costo Total</span>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(product.totals.cost, product.currency)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Precio Sugerido</span>
                            <p className="font-semibold text-amber-600">
                              {formatCurrency(product.totals.priceSuggested, product.currency)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Creado</span>
                            <p className="font-medium text-gray-700">
                              {new Date(product.createdAt).toLocaleDateString('es-DO')}
                            </p>
                          </div>
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
  );
};