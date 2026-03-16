import { IResponse, PaginationMeta } from '@app/application';

export class OrderStatusHistoryResponse implements IResponse {
  id!: number;
  orderId!: number;
  status!: string;
  changedByUserId?: number;
  notes?: string;
  changedAt!: Date;
}

export class ListOrderStatusHistoriesResponse implements IResponse {
  data!: OrderStatusHistoryResponse[];
  meta!: PaginationMeta;
}
