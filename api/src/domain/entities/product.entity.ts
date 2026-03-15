import { AuditableEntity } from './base';

export class Product extends AuditableEntity {
  sku!: string;
  categoryId!: number;
  name!: string;
  description!: string;
  brand!: string;
  model?: string;
  price!: number;
  stock!: number;
  specifications?: Record<string, any>;
  status!: string;
}
