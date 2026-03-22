import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { CategoryResponse, ListCategoriesResponse } from './category.responses';
import { ApiProperty } from '@nestjs/swagger';


export class GetCategoryByIdQuery implements IQuery<CategoryResponse> {
  @ApiProperty()
  id!: number;
}

export class ListCategoriesQuery implements IQuery<ListCategoriesResponse> {
  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  sort?: string;
}
