import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateOrderStatusHistoryCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  orderId!: number;

  @IsString()
  @ApiProperty()
  status!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  changedByUserId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusHistoryCommand implements ICommand {
  id!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class DeleteOrderStatusHistoryCommand implements ICommand {
  id!: number;
}
