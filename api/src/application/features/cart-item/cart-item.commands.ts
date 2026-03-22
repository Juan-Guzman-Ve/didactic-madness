import { IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  cartId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class UpdateCartItemCommand implements ICommand {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class DeleteCartItemCommand implements ICommand {
  @ApiProperty()
  id!: number;
}
