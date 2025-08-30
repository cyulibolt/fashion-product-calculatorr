import { create } from 'zustand';
import { Product, CreateProductRequest } from './types';
import { calculateProductTotals, generateProductCode } from './calculations';
import { productService } from '../../lib/database';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadProducts: () => Promise<void>;
  createProduct: (request: CreateProductRequest) => Promise<string>;
  updateProduct: (id: string, changes: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  addImageToProduct: (productId: string, image: { url: string; caption?: string }) => Promise<void>;
  updateProductImage: (productId: string, imageId: string, changes: Partial<{ caption: string; isCover: boolean; sort: number }>) => Promise<void>;
  removeImageFromProduct: (productId: string, imageId: string) => Promise<void>;
  reorderProductImages: (productId: string, imageIds: string[]) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productService.getAll();
      set({ products, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar productos', loading: false });
    }
  },

  createProduct: async (request: CreateProductRequest) => {
    set({ loading: true, error: null });
    try {
      const now = new Date().toISOString();
      const totals = calculateProductTotals(request.costs);
      
      const product: Product = {
        id: crypto.randomUUID(),
        code: generateProductCode(),
        title: request.title,
        clientName: request.clientName,
        status: 'draft',
        currency: request.currency,
        createdAt: now,
        updatedAt: now,
        costs: request.costs,
        totals,
        gallery: [],
        notes: request.notes
      };

      await productService.create(product);
      const products = await productService.getAll();
      set({ products, loading: false });
      return product.id;
    } catch (error) {
      set({ error: 'Error al crear producto', loading: false });
      throw error;
    }
  },

  updateProduct: async (id: string, changes: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      if (changes.costs) {
        changes.totals = calculateProductTotals(changes.costs);
      }
      
      await productService.update(id, changes);
      const products = await productService.getAll();
      set({ products, loading: false });
    } catch (error) {
      set({ error: 'Error al actualizar producto', loading: false });
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await productService.delete(id);
      const products = await productService.getAll();
      set({ products, loading: false });
    } catch (error) {
      set({ error: 'Error al eliminar producto', loading: false });
    }
  },

  getProduct: (id: string) => {
    return get().products.find(p => p.id === id);
  },

  addImageToProduct: async (productId: string, image: { url: string; caption?: string }) => {
    const product = get().getProduct(productId);
    if (!product) return;

    const newImage = {
      id: crypto.randomUUID(),
      url: image.url,
      caption: image.caption,
      isCover: product.gallery.length === 0,
      sort: product.gallery.length
    };

    const updatedGallery = [...product.gallery, newImage];
    await get().updateProduct(productId, { gallery: updatedGallery });
  },

  updateProductImage: async (productId: string, imageId: string, changes: Partial<{ caption: string; isCover: boolean; sort: number }>) => {
    const product = get().getProduct(productId);
    if (!product) return;

    let updatedGallery = product.gallery.map(img => 
      img.id === imageId ? { ...img, ...changes } : img
    );

    // If setting as cover, remove cover from others
    if (changes.isCover) {
      updatedGallery = updatedGallery.map(img => ({
        ...img,
        isCover: img.id === imageId
      }));
    }

    await get().updateProduct(productId, { gallery: updatedGallery });
  },

  removeImageFromProduct: async (productId: string, imageId: string) => {
    const product = get().getProduct(productId);
    if (!product) return;

    const imageToRemove = product.gallery.find(img => img.id === imageId);
    const updatedGallery = product.gallery.filter(img => img.id !== imageId);

    // If removing cover image, set first image as cover
    if (imageToRemove?.isCover && updatedGallery.length > 0) {
      updatedGallery[0].isCover = true;
    }

    await get().updateProduct(productId, { gallery: updatedGallery });
  },

  reorderProductImages: async (productId: string, imageIds: string[]) => {
    const product = get().getProduct(productId);
    if (!product) return;

    const reorderedGallery = imageIds.map((id, index) => {
      const image = product.gallery.find(img => img.id === id);
      return image ? { ...image, sort: index } : null;
    }).filter(Boolean) as typeof product.gallery;

    await get().updateProduct(productId, { gallery: reorderedGallery });
  }
}));