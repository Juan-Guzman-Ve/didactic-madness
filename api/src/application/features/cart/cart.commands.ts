import { IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId!: number;
}

export class UpdateCartCommand implements ICommand {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId!: number;
}

export class DeleteCartCommand implements ICommand {
  @ApiProperty()
  id!: number;
}
