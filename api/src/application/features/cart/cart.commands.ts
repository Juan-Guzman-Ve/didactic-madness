import { IsInt, IsPositive } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateCartCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId!: number;
}

export class UpdateCartCommand implements ICommand {
  id!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId!: number;
}

export class DeleteCartCommand implements ICommand {
  id!: number;
}
