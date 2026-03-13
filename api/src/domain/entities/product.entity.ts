import { AuditableEntity } from './base';

export class Product implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  sku!: string;
  categoryId!: string;
  name!: string;
  description!: string;
  brand!: string;
  model?: string;
  price!: number;
  stock!: number;
  specifications?: Record<string, any>;
  status!: string;
}
