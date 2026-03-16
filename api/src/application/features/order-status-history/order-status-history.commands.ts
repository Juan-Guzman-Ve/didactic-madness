import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateOrderStatusHistoryCommand implements ICommand {
  @IsInt()
  @IsPositive()
  orderId!: number;

  @IsString()
  status!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  changedByUserId?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusHistoryCommand implements ICommand {
  id!: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class DeleteOrderStatusHistoryCommand implements ICommand {
  id!: number;
}
