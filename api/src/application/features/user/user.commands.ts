import { IsEmail, IsString, IsOptional, IsInt, MinLength, MaxLength } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserCommand implements ICommand {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  passwordHash!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsInt()
  roleId!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateUserCommand implements ICommand {
  id!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  passwordHash?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  roleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class DeleteUserCommand implements ICommand {
  id!: number;
}
