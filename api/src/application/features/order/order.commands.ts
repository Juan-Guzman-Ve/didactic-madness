import { IsString, IsOptional, IsInt, IsPositive, IsNumber } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderCommand implements ICommand {
  @ApiProperty()
  @IsString()
  orderNumber!: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  addressId!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  totalAmount!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentStatus?: string;
}

export class UpdateOrderCommand implements ICommand {
  @ApiProperty()
  id!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  addressId?: number;
}

export class DeleteOrderCommand implements ICommand {
  @ApiProperty()
  id!: number;
}

export class CheckoutCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  addressId!: number;

  userId!: number;
}
