import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateRoleCommand implements ICommand {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateRoleCommand implements ICommand {
  id!: number; // injected from URL param by BaseController

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class DeleteRoleCommand implements ICommand {
  id!: number; // injected from URL param by BaseController
}
