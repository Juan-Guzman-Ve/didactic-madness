import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { CartResponse, ListCartsResponse } from './cart.responses';
import { ApiProperty } from '@nestjs/swagger';

export class GetCartByIdQuery implements IQuery<CartResponse> {
  @ApiProperty()
  id!: number;
}

export class ListCartsQuery implements IQuery<ListCartsResponse> {
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
