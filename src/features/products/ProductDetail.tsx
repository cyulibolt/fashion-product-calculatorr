import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Image, Star, Trash2 } from 'lucide-react';
import { useProductsStore } from './useProductsStore';
import { formatCurrency } from './calculations';
import { Button } from '../../components/ui/Button';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, updateProductImage, removeImageFromProduct } = useProductsStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const product = getProduct(id!);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
          <Link to="/products" className="text-amber-600 hover:text-amber-700">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const laborCost = product.costs.laborHours * product.costs.laborRate;
  const base = product.costs.materials + laborCost;
  const overhead = ((product.costs.overheadPct ?? 0) / 100) * base;

  const costBreakdown = [
    { label: 'Materiales', amount: product.costs.materials, color: 'bg-blue-500' },
    { label: 'Mano de obra', amount: laborCost, color: 'bg-green-500' },
    { label: 'Transporte', amount: product.costs.travel, color: 'bg-purple-500' },
    { label: 'Servicios externos', amount: product.costs.services, color: 'bg-orange-500' },
    ...(product.costs.extras ? [{ label: 'Extras', amount: product.costs.extras, color: 'bg-pink-500' }] : []),
    ...(overhead > 0 ? [{ label: `Overhead (${product.costs.overheadPct}%)`, amount: overhead, color: 'bg-gray-500' }] : [])
  ];

  const maxAmount = Math.max(...costBreakdown.map(item => item.amount));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/products')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                  <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-mono">
                    {product.code}
                  </span>
                </div>
                {product.clientName && (
                  <p className="text-gray-600">Cliente: {product.clientName}</p>
                )}
              </div>
            </div>
            <Button variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cost Summary Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Costo Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.totals.cost, product.currency)}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <p className="text-sm text-amber-700 mb-1">Precio Sugerido</p>
                <p className="text-2xl font-bold text-amber-700">
                  {formatCurrency(product.totals.priceSuggested, product.currency)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-sm text-green-700 mb-1">Margen</p>
                <p className="text-2xl font-bold text-green-700">
                  {(product.totals.marginPct * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Desglose de Costos</h3>
              <div className="space-y-4">
                {costBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900 w-24 text-right">
                        {formatCurrency(item.amount, product.currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {product.notes && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notas</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{product.notes}</p>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Galería</h3>
                <Button variant="ghost" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  Gestionar
                </Button>
              </div>

              {product.gallery.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No hay imágenes</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {product.gallery
                    .sort((a, b) => a.sort - b.sort)
                    .map((image) => (
                      <div
                        key={image.id}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.caption || 'Producto'}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {image.isCover && (
                          <div className="absolute top-1 left-1 bg-amber-600 text-white p-1 rounded text-xs">
                            <Star className="w-3 h-3" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg"></div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.status === 'active' ? 'Activo' : 'Borrador'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Moneda</span>
                  <span className="font-medium">{product.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Creado</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString('es-DO')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actualizado</span>
                  <span className="font-medium">
                    {new Date(product.updatedAt).toLocaleDateString('es-DO')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Producto"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};