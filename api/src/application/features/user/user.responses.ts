import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: '+1234567890', required: false })
  phone?: string;

  @ApiProperty({ example: 2 })
  roleId!: number;

  @ApiProperty({ example: 'Active' })
  status!: string;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListUsersResponse implements IResponse {
  @ApiProperty({ type: [UserResponse] })
  data!: UserResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
