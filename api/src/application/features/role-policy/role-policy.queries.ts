import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { RolePolicyResponse, ListRolePoliciesResponse } from './role-policy.responses';

export class GetRolePolicyByIdQuery implements IQuery<RolePolicyResponse> {
  id!: number;
}

export class ListRolePoliciesQuery implements IQuery<ListRolePoliciesResponse> {
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
