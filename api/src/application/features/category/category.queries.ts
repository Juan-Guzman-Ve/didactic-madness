import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { CategoryResponse, ListCategoriesResponse } from './category.responses';

export class GetCategoryByIdQuery implements IQuery<CategoryResponse> {
  id!: number;
}

export class ListCategoriesQuery implements IQuery<ListCategoriesResponse> {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
