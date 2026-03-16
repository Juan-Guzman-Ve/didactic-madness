import { IsInt, IsPositive, IsNumber, IsOptional } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateOrderItemCommand implements ICommand {
  @IsInt()
  @IsPositive()
  orderId!: number;

  @IsInt()
  @IsPositive()
  productId!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsNumber()
  @IsPositive()
  priceAtPurchase!: number;
}

export class UpdateOrderItemCommand implements ICommand {
  id!: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  priceAtPurchase?: number;
}

export class DeleteOrderItemCommand implements ICommand {
  id!: number;
}
