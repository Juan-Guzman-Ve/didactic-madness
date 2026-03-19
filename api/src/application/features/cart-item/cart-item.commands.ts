import { IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

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
  id!: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class DeleteCartItemCommand implements ICommand {
  id!: number;
}
