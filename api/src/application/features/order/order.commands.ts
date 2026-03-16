import { IsString, IsOptional, IsInt, IsPositive, IsNumber } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateOrderCommand implements ICommand {
  @IsString()
  orderNumber!: string;

  @IsInt()
  @IsPositive()
  userId!: number;

  @IsInt()
  @IsPositive()
  addressId!: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  @IsPositive()
  totalAmount!: number;

  @IsOptional()
  @IsString()
  paymentStatus?: string;
}

export class UpdateOrderCommand implements ICommand {
  id!: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  addressId?: number;
}

export class DeleteOrderCommand implements ICommand {
  id!: number;
}
