import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { PolicyResponse, ListPoliciesResponse } from './policy.responses';
 

export class GetPolicyByIdQuery implements IQuery<PolicyResponse> {
  @ApiProperty()
  id!: number;
}

export class ListPoliciesQuery implements IQuery<ListPoliciesResponse> {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sort?: string;
}
