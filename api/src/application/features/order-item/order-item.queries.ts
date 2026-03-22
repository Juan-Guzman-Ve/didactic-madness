import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { OrderItemResponse, ListOrderItemsResponse } from './order-item.responses';
 

export class GetOrderItemByIdQuery implements IQuery<OrderItemResponse> {
  @ApiProperty()
  id!: number;
}

export class ListOrderItemsQuery implements IQuery<ListOrderItemsResponse> {
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
