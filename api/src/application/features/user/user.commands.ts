import { IsEmail, IsString, IsOptional, IsInt, MinLength, MaxLength } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateUserCommand implements ICommand {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  passwordHash!: string;

  @IsString()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsInt()
  roleId!: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateUserCommand implements ICommand {
  id!: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  passwordHash?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  roleId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class DeleteUserCommand implements ICommand {
  id!: number;
}
