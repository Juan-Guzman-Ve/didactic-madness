import { IsInt, IsPositive, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {

  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class SyncCartItemsCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  cartId!: number;

  @ApiProperty({ type: [CartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];

  userId!: number;
}

export class AddToCartCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId!: number;

  @ApiProperty({ minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  // Set by controller from JWT — not exposed in request body
  userId!: number;
}
