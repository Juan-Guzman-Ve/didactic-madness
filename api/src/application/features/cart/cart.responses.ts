import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CartResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListCartsResponse implements IResponse {
  @ApiProperty({ type: [CartResponse] })
  data!: CartResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
