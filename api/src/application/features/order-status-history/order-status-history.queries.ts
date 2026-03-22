import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { OrderStatusHistoryResponse, ListOrderStatusHistoriesResponse } from './order-status-history.responses';
 

export class GetOrderStatusHistoryByIdQuery implements IQuery<OrderStatusHistoryResponse> {
  @ApiProperty()
  id!: number;
}

export class ListOrderStatusHistoriesQuery implements IQuery<ListOrderStatusHistoriesResponse> {
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
