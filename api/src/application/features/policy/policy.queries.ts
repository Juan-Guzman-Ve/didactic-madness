import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { PolicyResponse, ListPoliciesResponse } from './policy.responses';

export class GetPolicyByIdQuery implements IQuery<PolicyResponse> {
  id!: number;
}

export class ListPoliciesQuery implements IQuery<ListPoliciesResponse> {
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
