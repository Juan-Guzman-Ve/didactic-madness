import { ICommand } from '@app/application/contracts/base';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateRoleCommand implements ICommand {
  @ApiProperty({
    example: '6f430b6d-29f0-4f34-8d65-cbf9bdf0f438',
    description: 'Role ID',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: 'Manager',
    description: 'Role name',
    required: false,
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: 'Can manage products and categories',
    description: 'Role description',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
