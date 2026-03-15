import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteRoleCommand , ICommandHandler} from '@app/application';
import { PolicyRepository } from '@app/infra/database/repositories/policy.repository';

@Injectable()
export class DeletePolicyCommandHandler implements ICommandHandler<DeletePolicyCommandHandler, void> {
  constructor(private readonly repository: PolicyRepository) {}

  async execute(command: DeletePolicyCommandHandler): Promise<void> {
    const exists = await this.repository.exists(command.id);

    if (!exists) {
      throw new NotFoundException(`Role with ID ${command.id} not found`);
    }

    await this.repository.deleteById(command.id);
  }
}
