import { IQuery } from '@app/application/contracts/base';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { RoleResponse } from '../role.response';

export class GetRoleByIdQuery implements IQuery<RoleResponse> {
  @ApiProperty({
    example: '6f430b6d-29f0-4f34-8d65-cbf9bdf0f438',
    description: 'Role ID',
  })
  @IsUUID()
  id!: string;
}
