import { IResponse, PaginationMeta } from '@app/application';

export class OrderResponse implements IResponse {
  id!: number;
  orderNumber!: string;
  userId!: number;
  addressId!: number;
  status!: string;
  totalAmount!: number;
  paymentStatus!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListOrdersResponse implements IResponse {
  data!: OrderResponse[];
  meta!: PaginationMeta;
}
