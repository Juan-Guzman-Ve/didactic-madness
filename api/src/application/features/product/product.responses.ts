
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'SKU123' })
  sku!: string;

  @ApiProperty({ example: 2 })
  categoryId!: number;

  @ApiProperty({ example: 'Laptop' })
  name!: string;

  @ApiProperty({ example: 'High performance laptop' })
  description!: string;

  @ApiProperty({ example: 'BrandX' })
  brand!: string;

  @ApiProperty({ example: 'ModelY', required: false })
  model?: string;

  @ApiProperty({ example: 999.99 })
  price!: number;

  @ApiProperty({ example: 10 })
  stock!: number;

  @ApiProperty({ example: { ram: '16GB', cpu: 'i7' }, required: false })
  specifications?: Record<string, unknown>;

  @ApiProperty({ example: 'active' })
  status!: string;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListProductsResponse implements IResponse {
  @ApiProperty({ type: [ProductResponse] })
  data!: ProductResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
