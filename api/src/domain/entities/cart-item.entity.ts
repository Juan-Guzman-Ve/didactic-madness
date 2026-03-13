import { AuditableEntity } from './base';

export class CartItem implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  cartId!: string;
  productId!: string;
  quantity!: number;
}
