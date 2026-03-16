import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRoleRepository, ROLE_REPOSITORY, ICommandHandler } from '@app/application';
import { Role } from '@app/domain';
import { CreateRoleCommand, UpdateRoleCommand, DeleteRoleCommand } from './role.commands';
import { RoleResponse } from './role.responses';
import { RoleMapper } from './role.mapper';

@Injectable()
export class CreateRoleCommandHandler implements ICommandHandler<CreateRoleCommand, RoleResponse> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: CreateRoleCommand): Promise<RoleResponse> {
    const role = Object.assign(new Role(), {
      name: command.name,
      description: command.description,
    });
    const saved = await this.roleRepository.create(role);
    return RoleMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateRoleCommandHandler implements ICommandHandler<UpdateRoleCommand, RoleResponse> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<RoleResponse> {
    const existing = await this.roleRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`Role with ID ${command.id} not found`);

    const updated = await this.roleRepository.updateById(command.id, {
      name: command.name,
      description: command.description,
    });
    return RoleMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteRoleCommandHandler implements ICommandHandler<DeleteRoleCommand, void> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const exists = await this.roleRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`Role with ID ${command.id} not found`);

    await this.roleRepository.deleteById(command.id);
  }
}
