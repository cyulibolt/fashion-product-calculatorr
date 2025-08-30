import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useProductsStore } from './useProductsStore';
import { CreateProductRequest, Currency, ProductCosts } from './types';
import { NumberField } from '../../components/ui/NumberField';
import { CostSummary } from '../../components/ui/CostSummary';
import { Button } from '../../components/ui/Button';
import { GalleryManager } from './GalleryManager';

export const ProductCreateWizard: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct, updateProduct, loading } = useProductsStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProductRequest>({
    title: '',
    clientName: '',
    currency: 'DOP',
    costs: {
      materials: 0,
      laborHours: 0,
      laborRate: 0,
      travel: 0,
      services: 0,
      extras: 0,
      overheadPct: 0
    },
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (formData.costs.laborHours > 0 && formData.costs.laborRate === 0) {
      newErrors.laborRate = 'Especifica la tarifa por hora si hay horas de trabajo';
    }

    if (formData.costs.laborRate > 0 && formData.costs.laborHours === 0) {
      newErrors.laborHours = 'Especifica las horas si hay una tarifa por hora';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      
      try {
        const id = await createProduct(formData);
        setProductId(id);
        setCurrentStep(2);
      } catch (error) {
        console.error('Error creating product:', error);
      }
    }
  };

  const handleFinish = () => {
    navigate('/products');
  };

  const updateCosts = (field: keyof ProductCosts, value: number) => {
    setFormData(prev => ({
      ...prev,
      costs: {
        ...prev.costs,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => currentStep === 1 ? navigate('/products') : setCurrentStep(1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentStep === 1 ? 'Nuevo Producto' : 'Galería de Imágenes'}
              </h1>
              <p className="text-gray-600">Paso {currentStep} de 2</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Datos básicos</span>
              <span>Galería</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Información del Producto</h2>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título del Producto *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ej: Vestido de noche bordado"
                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                          errors.title ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cliente
                      </label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Nombre del cliente"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Moneda
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as Currency }))}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      >
                        <option value="DOP">Pesos Dominicanos (RD$)</option>
                        <option value="USD">Dólares (US$)</option>
                      </select>
                    </div>
                  </div>

                  {/* Cost Fields */}
                  <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Costos del Producto</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <NumberField
                        label="Materiales"
                        value={formData.costs.materials}
                        onChange={(value) => updateCosts('materials', value)}
                        prefix={formData.currency === 'DOP' ? 'RD$' : '$'}
                        required
                      />

                      <NumberField
                        label="Servicios Externos"
                        value={formData.costs.services}
                        onChange={(value) => updateCosts('services', value)}
                        prefix={formData.currency === 'DOP' ? 'RD$' : '$'}
                        placeholder="Bordado, estampado, etc."
                      />

                      <NumberField
                        label="Horas de Trabajo"
                        value={formData.costs.laborHours}
                        onChange={(value) => updateCosts('laborHours', value)}
                        suffix="hrs"
                        step={0.5}
                        error={errors.laborHours}
                      />

                      <NumberField
                        label="Tarifa por Hora"
                        value={formData.costs.laborRate}
                        onChange={(value) => updateCosts('laborRate', value)}
                        prefix={formData.currency === 'DOP' ? 'RD$' : '$'}
                        error={errors.laborRate}
                      />

                      <NumberField
                        label="Transporte/Logística"
                        value={formData.costs.travel}
                        onChange={(value) => updateCosts('travel', value)}
                        prefix={formData.currency === 'DOP' ? 'RD$' : '$'}
                      />

                      <NumberField
                        label="Extras/Empaque"
                        value={formData.costs.extras || 0}
                        onChange={(value) => updateCosts('extras', value)}
                        prefix={formData.currency === 'DOP' ? 'RD$' : '$'}
                        placeholder="Opcional"
                      />

                      <div className="sm:col-span-2">
                        <NumberField
                          label="Overhead"
                          value={formData.costs.overheadPct || 0}
                          onChange={(value) => updateCosts('overheadPct', value)}
                          suffix="%"
                          placeholder="% sobre materiales + mano de obra"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Notas adicionales sobre el producto..."
                      rows={3}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Summary - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CostSummary costs={formData.costs} currency={formData.currency} />
                
                <div className="mt-6">
                  <Button
                    onClick={handleNext}
                    loading={loading}
                    className="w-full"
                    disabled={!formData.title.trim()}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Guardar y Continuar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {productId && (
              <GalleryManager 
                productId={productId} 
                onFinish={handleFinish}
                onBack={() => setCurrentStep(1)}
              />
            )}
            
            <div className="mt-8 flex justify-center">
              <Button onClick={handleFinish} size="lg">
                <Save className="w-4 h-4 mr-2" />
                Finalizar Producto
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};