import { IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  productId!: string;

  @IsUUID()
  quantity!: number;

  @IsUUID()
  priceAtPurchase!: number;
}

export class CreateOrderDto {
  @IsUUID()
  addressId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
