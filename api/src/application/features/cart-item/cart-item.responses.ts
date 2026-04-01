
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  cartId!: number;

  @ApiProperty({ example: 1 })
  productId!: number;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListCartItemsResponse implements IResponse {
  @ApiProperty({ type: [CartItemResponse] })
  data!: CartItemResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
