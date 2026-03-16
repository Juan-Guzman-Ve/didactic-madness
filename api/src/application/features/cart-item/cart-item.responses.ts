import { IResponse, PaginationMeta } from '@app/application';

export class CartItemResponse implements IResponse {
  id!: number;
  cartId!: number;
  productId!: number;
  quantity!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListCartItemsResponse implements IResponse {
  data!: CartItemResponse[];
  meta!: PaginationMeta;
}
