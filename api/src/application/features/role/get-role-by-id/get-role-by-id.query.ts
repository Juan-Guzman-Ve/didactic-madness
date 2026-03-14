import { IQuery, RoleResponse } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetRoleByIdQuery implements IQuery<RoleResponse> {
  @ApiProperty({
    example: '6f430b6d-29f0-4f34-8d65-cbf9bdf0f438',
    description: 'Role ID',
  })
  @IsUUID()
  id!: string;
}
