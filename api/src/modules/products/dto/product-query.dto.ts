import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  inStock?: boolean;

  @IsOptional()
  @IsString()
  sort?: string; // e.g., 'price:asc', 'name:desc'

  @IsOptional()
  @IsString()
  search?: string;
}
