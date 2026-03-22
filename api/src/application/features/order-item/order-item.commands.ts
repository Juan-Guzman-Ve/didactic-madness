import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNumber, IsOptional } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateOrderItemCommand implements ICommand {
  
  @ApiProperty()
  @IsInt()
  @IsPositive()
  orderId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  priceAtPurchase!: number;
}

export class UpdateOrderItemCommand implements ICommand {
  @ApiProperty()
  id!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  priceAtPurchase?: number;
}

export class DeleteOrderItemCommand implements ICommand {
  @ApiProperty()
  id!: number;
}
