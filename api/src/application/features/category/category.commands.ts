import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateCategoryCommand implements ICommand {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MaxLength(100)
  slug!: string;
}

export class UpdateCategoryCommand implements ICommand {
  id!: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;
}

export class DeleteCategoryCommand implements ICommand {
  id!: number;
}
