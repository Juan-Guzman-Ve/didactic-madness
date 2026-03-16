import { IsString, IsOptional, IsInt, IsPositive, IsObject } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateProductCommand implements ICommand {
  @IsString()
  sku!: string;

  @IsInt()
  @IsPositive()
  categoryId!: number;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  brand!: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsInt()
  @IsPositive()
  price!: number;

  @IsInt()
  @IsPositive()
  stock!: number;

  @IsOptional()
  @IsObject()
  specifications?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateProductCommand implements ICommand {
  id!: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsObject()
  specifications?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  status?: string;
}

export class DeleteProductCommand implements ICommand {
  id!: number;
}
