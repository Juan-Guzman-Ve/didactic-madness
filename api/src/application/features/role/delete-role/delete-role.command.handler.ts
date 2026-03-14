import { Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository, DeleteRoleCommand , ICommandHandler} from '@app/application';

@Injectable()
export class DeleteRoleCommandHandler implements ICommandHandler<DeleteRoleCommand, void> {
  constructor(private readonly repository: IRoleRepository) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const exists = await this.repository.exists(command.id);

    if (!exists) {
      throw new NotFoundException(`Role with ID ${command.id} not found`);
    }

    await this.repository.deleteById(command.id);
  }
}
