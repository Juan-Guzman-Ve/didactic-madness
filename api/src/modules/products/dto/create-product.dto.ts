import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  sku: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  brand: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: string;
}
