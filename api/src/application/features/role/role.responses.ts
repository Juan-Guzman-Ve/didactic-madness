
import { IResponse } from '@app/application';
import { PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class RoleResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Admin' })
  name!: string;

  @ApiProperty({ example: 'Administrator role', required: false })
  description?: string;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListRolesResponse implements IResponse {
  @ApiProperty({ type: [RoleResponse] })
  data!: RoleResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
