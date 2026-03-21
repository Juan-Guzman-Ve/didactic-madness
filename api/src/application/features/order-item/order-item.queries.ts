import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { OrderItemResponse, ListOrderItemsResponse } from './order-item.responses';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class GetOrderItemByIdQuery implements IQuery<OrderItemResponse> {
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
