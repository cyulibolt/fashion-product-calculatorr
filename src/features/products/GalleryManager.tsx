import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Star, Edit3, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useProductsStore } from './useProductsStore';
import { ProductImage } from './types';

interface GalleryManagerProps {
  productId: string;
  onFinish?: () => void;
  onBack?: () => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ 
  productId, 
  onFinish, 
  onBack 
}) => {
  const { getProduct, addImageToProduct, updateProductImage, removeImageFromProduct, reorderProductImages } = useProductsStore();
  const [dragActive, setDragActive] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const product = getProduct(productId);
  const images = product?.gallery || [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result) {
            await addImageToProduct(productId, {
              url: e.target.result as string,
              caption: file.name.split('.')[0]
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const startEditing = (image: ProductImage) => {
    setEditingImage(image.id);
    setEditCaption(image.caption || '');
  };

  const saveEdit = async () => {
    if (editingImage) {
      await updateProductImage(productId, editingImage, { caption: editCaption });
      setEditingImage(null);
      setEditCaption('');
    }
  };

  const cancelEdit = () => {
    setEditingImage(null);
    setEditCaption('');
  };

  const setCover = async (imageId: string) => {
    await updateProductImage(productId, imageId, { isCover: true });
  };

  const removeImage = async (imageId: string) => {
    await removeImageFromProduct(productId, imageId);
  };

  const moveImage = async (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const reorderedImages = [...images];
    [reorderedImages[currentIndex], reorderedImages[newIndex]] = 
    [reorderedImages[newIndex], reorderedImages[currentIndex]];

    const newOrder = reorderedImages.map(img => img.id);
    await reorderProductImages(productId, newOrder);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Galería del Producto</h2>
        <p className="text-gray-600">Sube y gestiona las imágenes de tu producto</p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 mb-8 ${
          dragActive
            ? 'border-amber-400 bg-amber-50 scale-105'
            : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Arrastra imágenes aquí o haz clic para subir
        </p>
        <p className="text-sm text-gray-500">
          PNG, JPG, GIF hasta 10MB cada una
        </p>
      </div>

      {/* Image Gallery */}
      {images.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Imágenes Subidas ({images.length})
          </h3>
          
          <div className="grid gap-6">
            {images
              .sort((a, b) => a.sort - b.sort)
              .map((image, index) => (
                <div key={image.id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-start space-x-6">
                    {/* Image Preview */}
                    <div className="flex-shrink-0 relative group">
                      <div 
                        className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.caption || `Imagen ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      {image.isCover && (
                        <div className="absolute -top-2 -right-2 bg-amber-600 text-white p-1.5 rounded-full shadow-md">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 min-w-0">
                      {editingImage === image.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Descripción de la imagen
                            </label>
                            <input
                              type="text"
                              value={editCaption}
                              onChange={(e) => setEditCaption(e.target.value)}
                              placeholder="Descripción de la imagen..."
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          </div>
                          <div className="flex space-x-3">
                            <Button size="sm" onClick={saveEdit}>
                              <Save className="w-4 h-4 mr-2" />
                              Guardar
                            </Button>
                            <Button variant="secondary" size="sm" onClick={cancelEdit}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {image.caption || `Imagen ${index + 1}`}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Posición: {index + 1} de {images.length}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => startEditing(image)}
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            
                            {!image.isCover && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setCover(image.id)}
                              >
                                <Star className="w-4 h-4 mr-1" />
                                Portada
                              </Button>
                            )}

                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => moveImage(image.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-4 h-4 mr-1" />
                              Subir
                            </Button>

                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => moveImage(image.id, 'down')}
                              disabled={index === images.length - 1}
                            >
                              <ArrowDown className="w-4 h-4 mr-1" />
                              Bajar
                            </Button>

                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeImage(image.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay imágenes aún</h3>
          <p className="text-gray-500">Sube la primera imagen de tu producto</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between">
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Volver
          </Button>
        )}
        <div className="flex gap-3 ml-auto">
          {images.length > 0 && (
            <Button 
              variant="secondary" 
              onClick={() => {
                images.forEach(image => removeImage(image.id));
              }}
            >
              Limpiar Todo
            </Button>
          )}
          {onFinish && (
            <Button onClick={onFinish}>
              <Save className="w-4 h-4 mr-2" />
              Finalizar Galería
            </Button>
          )}
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
              alt="Vista ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};