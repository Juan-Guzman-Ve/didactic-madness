import { ConflictException, Injectable } from '@nestjs/common';
import { ICommandHandler } from '@app/application/contracts/base';
import { Role } from '@app/domain/entities';
import { RoleRepository } from '@app/infra/database/repositories';
import { CreateRoleCommand } from './create-role.command';

@Injectable()
export class CreateRoleCommandHandler implements ICommandHandler<CreateRoleCommand, Role> {
  constructor(private readonly repository: RoleRepository) {}

  async execute(command: CreateRoleCommand): Promise<Role> {
    const existing = await this.repository.findOne(
      (role) => role.name.toLowerCase() === command.name.toLowerCase(),
    );

    if (existing) {
      throw new ConflictException(`Role ${command.name} already exists`);
    }

    const role = Object.assign(new Role(), {
      name: command.name,
      description: command.description,
    });

    return this.repository.create(role);
  }
}
