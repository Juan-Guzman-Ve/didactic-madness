import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Electronics' })
  name!: string;

  @ApiProperty({ example: 'Devices and gadgets', required: false })
  description?: string;

  @ApiProperty({ example: 'electronics' })
  slug!: string;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListCategoriesResponse implements IResponse {
  @ApiProperty({ type: [CategoryResponse] })
  data!: CategoryResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
