import { ICommand } from '@app/application/contracts/base';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleCommand implements ICommand {
  @ApiProperty({
    example: 'Manager',
    description: 'Role name',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'Can manage products and categories',
    description: 'Optional role description',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  description?: string;
}
