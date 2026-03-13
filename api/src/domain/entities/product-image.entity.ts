import { AuditableEntity } from './base';

export class ProductImage implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  productId!: string;
  url!: string;
  displayOrder!: number;
}
