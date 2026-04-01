
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class OrderStatusHistoryResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  orderId!: number;

  @ApiProperty({ example: 'Shipped' })
  status!: string;

  @ApiProperty({ example: 2, required: false })
  changedByUserId?: number;

  @ApiProperty({ example: 'Order shipped via UPS', required: false })
  notes?: string;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  changedAt!: Date;
}

export class ListOrderStatusHistoriesResponse implements IResponse {
  @ApiProperty({ type: [OrderStatusHistoryResponse] })
  data!: OrderStatusHistoryResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
