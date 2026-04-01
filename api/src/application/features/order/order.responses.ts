
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class OrderResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'ORD-20240331-0001' })
  orderNumber!: string;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty({ example: 1 })
  addressId!: number;

  @ApiProperty({ example: 'Pending' })
  status!: string;

  @ApiProperty({ example: 199.99 })
  totalAmount!: number;

  @ApiProperty({ example: 'Paid' })
  paymentStatus!: string;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListOrdersResponse implements IResponse {
  @ApiProperty({ type: [OrderResponse] })
  data!: OrderResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
