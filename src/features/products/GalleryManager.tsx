import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface GalleryManagerProps {
  productId?: string;
  onFinish?: () => void;
  onBack?: () => void;
}

export function GalleryManager({ productId, onFinish, onBack }: GalleryManagerProps) {
  const [images, setImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

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
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Gallery</h2>
        <p className="text-gray-600">Upload and manage product images</p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
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
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop images here or click to upload
        </p>
        <p className="text-sm text-gray-500">
          PNG, JPG, GIF up to 10MB each
        </p>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="mt-8 text-center py-12">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <div className="flex gap-3 ml-auto">
          <Button variant="outline" onClick={() => setImages([])}>
            Clear All
          </Button>
          {onFinish && (
            <Button onClick={onFinish}>
              Save Gallery
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}