import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';
 

export class CreateOrderStatusHistoryCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  orderId!: number;

  @ApiProperty()
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

// Status history is append-only — no update or delete
