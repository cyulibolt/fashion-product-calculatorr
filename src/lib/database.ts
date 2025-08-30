import Dexie, { Table } from 'dexie';
import { Product } from '../features/products/types';

export class FashionDatabase extends Dexie {
  products!: Table<Product>;

  constructor() {
    super('FashionStudioDB');
    this.version(1).stores({
      products: 'id, code, title, createdAt, status, currency'
    });
  }
}

export const db = new FashionDatabase();

export const productService = {
  async create(product: Product): Promise<string> {
    return await db.products.add(product);
  },

  async update(id: string, changes: Partial<Product>): Promise<void> {
    await db.products.update(id, { ...changes, updatedAt: new Date().toISOString() });
  },

  async delete(id: string): Promise<void> {
    await db.products.delete(id);
  },

  async getById(id: string): Promise<Product | undefined> {
    return await db.products.get(id);
  },

  async getAll(): Promise<Product[]> {
    return await db.products.orderBy('createdAt').reverse().toArray();
  },

  async getThisMonth(): Promise<Product[]> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return await db.products
      .where('createdAt')
      .above(firstDayOfMonth.toISOString())
      .toArray();
  }
};