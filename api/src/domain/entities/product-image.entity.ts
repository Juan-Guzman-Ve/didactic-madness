import { AuditableEntity } from './base';

export interface ProductImage extends AuditableEntity {
  productId: string;
  url: string;
  displayOrder: number;
}
