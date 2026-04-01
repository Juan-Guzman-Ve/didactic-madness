
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class ProductImageResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  productId!: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  url!: string;

  @ApiProperty({ example: 1 })
  displayOrder!: number;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListProductImagesResponse implements IResponse {
  @ApiProperty({ type: [ProductImageResponse] })
  data!: ProductImageResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
