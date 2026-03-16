import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { RoleResponse, ListRolesResponse } from './role.responses';

export class GetRoleByIdQuery implements IQuery<RoleResponse> {
  id!: number; // injected from URL param by BaseController
}

export class ListRolesQuery implements IQuery<ListRolesResponse> {
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
