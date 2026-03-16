import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRolePolicyRepository, ROLE_POLICY_REPOSITORY, ICommandHandler } from '@app/application';
import { RolePolicy } from '@app/domain';
import { CreateRolePolicyCommand, UpdateRolePolicyCommand, DeleteRolePolicyCommand } from './role-policy.commands';
import { RolePolicyResponse } from './role-policy.responses';
import { RolePolicyMapper } from './role-policy.mapper';

@Injectable()
export class CreateRolePolicyCommandHandler implements ICommandHandler<CreateRolePolicyCommand, RolePolicyResponse> {
  constructor(
    @Inject(ROLE_POLICY_REPOSITORY) private readonly rolePolicyRepository: IRolePolicyRepository,
  ) {}

  async execute(command: CreateRolePolicyCommand): Promise<RolePolicyResponse> {
    const rolePolicy = Object.assign(new RolePolicy(), {
      roleId: command.roleId,
      policyId: command.policyId,
    });
    const saved = await this.rolePolicyRepository.create(rolePolicy);
    return RolePolicyMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateRolePolicyCommandHandler implements ICommandHandler<UpdateRolePolicyCommand, RolePolicyResponse> {
  constructor(
    @Inject(ROLE_POLICY_REPOSITORY) private readonly rolePolicyRepository: IRolePolicyRepository,
  ) {}

  async execute(command: UpdateRolePolicyCommand): Promise<RolePolicyResponse> {
    const existing = await this.rolePolicyRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`RolePolicy with ID ${command.id} not found`);

    const updated = await this.rolePolicyRepository.updateById(command.id, {
      roleId: command.roleId,
      policyId: command.policyId,
    });
    return RolePolicyMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteRolePolicyCommandHandler implements ICommandHandler<DeleteRolePolicyCommand, void> {
  constructor(
    @Inject(ROLE_POLICY_REPOSITORY) private readonly rolePolicyRepository: IRolePolicyRepository,
  ) {}

  async execute(command: DeleteRolePolicyCommand): Promise<void> {
    const exists = await this.rolePolicyRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`RolePolicy with ID ${command.id} not found`);
    await this.rolePolicyRepository.deleteById(command.id);
  }
}
