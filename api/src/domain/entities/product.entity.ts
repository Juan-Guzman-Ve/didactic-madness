import { AuditableEntity } from './base';

export interface Product extends AuditableEntity {
  sku: string;
  categoryId: string;
  name: string;
  description: string;
  brand: string;
  model?: string;
  price: number;
  stock: number;
  specifications?: Record<string, any>;
  status: string;
}
