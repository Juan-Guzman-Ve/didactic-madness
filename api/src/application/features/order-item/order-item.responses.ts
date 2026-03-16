import { IResponse, PaginationMeta } from '@app/application';

export class OrderItemResponse implements IResponse {
  id!: number;
  orderId!: number;
  productId!: number;
  quantity!: number;
  priceAtPurchase!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListOrderItemsResponse implements IResponse {
  data!: OrderItemResponse[];
  meta!: PaginationMeta;
}
