import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICommandHandler } from '@app/application/contracts/base';
import { Role } from '@app/domain/entities';
import { RoleRepository } from '@app/infra/database/repositories';
import { UpdateRoleCommand } from './update-role.command';

@Injectable()
export class UpdateRoleCommandHandler implements ICommandHandler<UpdateRoleCommand, Role> {
  constructor(private readonly repository: RoleRepository) {}

  async execute(command: UpdateRoleCommand): Promise<Role> {
    const existing = await this.repository.findById(command.id);

    if (!existing) {
      throw new NotFoundException(`Role with ID ${command.id} not found`);
    }

    if (command.name && command.name.toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await this.repository.findOne(
        (role) => role.name.toLowerCase() === command.name!.toLowerCase(),
      );

      if (duplicate) {
        throw new ConflictException(`Role ${command.name} already exists`);
      }
    }

    return this.repository.updateById(command.id, {
      name: command.name ?? existing.name,
      description: command.description ?? existing.description,
    });
  }
}
