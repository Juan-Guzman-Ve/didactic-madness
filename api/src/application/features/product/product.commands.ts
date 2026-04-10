import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsPositive, IsObject } from 'class-validator';
import { ICommand } from '@app/application';
 

export class CreateProductCommand implements ICommand {
  @ApiProperty()
  @IsString()
  sku!: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  categoryId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsString()
  brand!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  price!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  stock!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  specifications?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateProductCommand implements ICommand {
  @ApiProperty()
  id!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  stock?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  specifications?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class DeleteProductCommand implements ICommand {
  @ApiProperty()
  id!: number;
}

export class BulkCreateProductsCommand implements ICommand {
  @ApiProperty({ type: [CreateProductCommand] })
  products!: CreateProductCommand[];
}
