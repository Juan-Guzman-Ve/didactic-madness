import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { PolicyResponse, ListPoliciesResponse } from './policy.responses';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class GetPolicyByIdQuery implements IQuery<PolicyResponse> {
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
