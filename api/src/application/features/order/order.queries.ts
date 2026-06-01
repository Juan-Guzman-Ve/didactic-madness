import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { OrderResponse, ListOrdersResponse } from './order.responses';
 

export class GetOrderByIdQuery implements IQuery<OrderResponse> {
  @ApiProperty()
  id!: number;

  userId?: number;
}

export class ListOrdersQuery implements IQuery<ListOrdersResponse> {
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

  userId?: number;
}
