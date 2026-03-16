import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ICommand } from '@app/application';

export class CreatePolicyCommand implements ICommand {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MaxLength(50)
  resource!: string;

  @IsString()
  @MaxLength(50)
  action!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePolicyCommand implements ICommand {
  id!: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  resource?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  action?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class DeletePolicyCommand implements ICommand {
  id!: number;
}
