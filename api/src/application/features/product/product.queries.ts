import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { ProductResponse, ListProductsResponse } from './product.responses';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class GetProductByIdQuery implements IQuery<ProductResponse> {
  @ApiProperty()
  id!: number;
}

export class ListProductsQuery implements IQuery<ListProductsResponse> {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sort?: string;
}
