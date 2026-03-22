import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateRolePolicyCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  roleId!: number;

  @ApiProperty()
  @IsInt()
  policyId!: number;
}

export class UpdateRolePolicyCommand implements ICommand {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  @IsInt()
  roleId!: number;

  @ApiProperty()
  @IsInt()
  policyId!: number;
}

export class DeleteRolePolicyCommand implements ICommand {
  @ApiProperty()
  id!: number;
}
