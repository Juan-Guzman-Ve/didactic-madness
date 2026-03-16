import { IsString, IsOptional, IsInt, IsPositive, IsUrl, Min } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateProductImageCommand implements ICommand {
  @IsInt()
  @IsPositive()
  productId!: number;

  @IsString()
  @IsUrl()
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class UpdateProductImageCommand implements ICommand {
  id!: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class DeleteProductImageCommand implements ICommand {
  id!: number;
}
