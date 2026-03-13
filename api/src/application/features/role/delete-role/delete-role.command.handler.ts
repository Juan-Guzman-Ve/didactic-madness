import { Injectable, NotFoundException } from '@nestjs/common';
import { ICommandHandler } from '@app/application/contracts/base';
import { DeleteRoleCommand } from './delete-role.command';
import { RoleRepository } from '@app/infra/database/repositories';

@Injectable()
export class DeleteRoleCommandHandler implements ICommandHandler<DeleteRoleCommand, void> {
  constructor(private readonly repository: RoleRepository) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const exists = await this.repository.exists(command.id);

    if (!exists) {
      throw new NotFoundException(`Role with ID ${command.id} not found`);
    }

    await this.repository.deleteById(command.id);
  }
}
