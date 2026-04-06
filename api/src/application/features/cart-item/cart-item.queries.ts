import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { CartItemResponse, ListCartItemsResponse } from './cart-item.responses';
import { ApiProperty } from '@nestjs/swagger';

export class ListCartItemsQuery implements IQuery<ListCartItemsResponse> {
  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  sort?: string;
}
