import { IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId!: number;
}