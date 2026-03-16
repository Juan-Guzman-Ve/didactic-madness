import { IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateCartCommand implements ICommand {
  @IsInt()
  @IsPositive()
  userId!: number;
}

export class UpdateCartCommand implements ICommand {
  id!: number;

  @IsInt()
  @IsPositive()
  userId!: number;
}

export class DeleteCartCommand implements ICommand {
  id!: number;
}
