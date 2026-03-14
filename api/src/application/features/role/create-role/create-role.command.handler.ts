import { ConflictException, Injectable } from '@nestjs/common';
import { Role } from '@app/domain';
import { IRoleRepository, CreateRoleCommand, ICommandHandler } from '@app/application';

@Injectable()
export class CreateRoleCommandHandler implements ICommandHandler<CreateRoleCommand, Role> {
  constructor(private readonly repository: IRoleRepository) {}

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
