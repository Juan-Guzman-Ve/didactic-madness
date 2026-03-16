import { IsInt } from 'class-validator';
import { ICommand } from '@app/application';

export class CreateRolePolicyCommand implements ICommand {
  @IsInt()
  roleId!: number;

  @IsInt()
  policyId!: number;
}

export class UpdateRolePolicyCommand implements ICommand {
  id!: number;

  @IsInt()
  roleId!: number;

  @IsInt()
  policyId!: number;
}

export class DeleteRolePolicyCommand implements ICommand {
  id!: number;
}
