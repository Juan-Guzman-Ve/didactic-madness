import { IQuery } from '@app/application/contracts/base';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ListRolesResponse } from '../role.response';

export class ListRolesQuery implements IQuery<ListRolesResponse> {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'name:asc', description: 'Format: field:asc|desc' })
  @IsOptional()
  @IsString()
  sort?: string;
}
