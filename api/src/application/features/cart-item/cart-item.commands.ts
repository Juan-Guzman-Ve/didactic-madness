import { IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateCartItemCommand implements ICommand {
  @IsInt()
  @IsPositive()
  cartId!: number;

  @IsInt()
  @IsPositive()
  productId!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class UpdateCartItemCommand implements ICommand {
  id!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class DeleteCartItemCommand implements ICommand {
  id!: number;
}
