
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class PolicyResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'View Orders' })
  name!: string;

  @ApiProperty({ example: 'order' })
  resource!: string;

  @ApiProperty({ example: 'read' })
  action!: string;

  @ApiProperty({ example: 'Allows viewing orders', required: false })
  description?: string;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListPoliciesResponse implements IResponse {
  @ApiProperty({ type: [PolicyResponse] })
  data!: PolicyResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
