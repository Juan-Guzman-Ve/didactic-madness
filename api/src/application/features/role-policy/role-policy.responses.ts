
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class RolePolicyResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  roleId!: number;

  @ApiProperty({ example: 1 })
  policyId!: number;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListRolePoliciesResponse implements IResponse {
  @ApiProperty({ type: [RolePolicyResponse] })
  data!: RolePolicyResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
