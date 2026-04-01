
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  orderId!: number;

  @ApiProperty({ example: 1 })
  productId!: number;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: 99.99 })
  priceAtPurchase!: number;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListOrderItemsResponse implements IResponse {
  @ApiProperty({ type: [OrderItemResponse] })
  data!: OrderItemResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
