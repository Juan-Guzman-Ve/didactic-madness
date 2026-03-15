import { AuditableEntity } from './base';

export class ProductImage extends AuditableEntity {
  productId!: number;
  url!: string;
  displayOrder!: number;
}
