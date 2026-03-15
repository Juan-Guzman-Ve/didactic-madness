import { ConflictException, Injectable } from '@nestjs/common';
import { Policy } from '@app/domain';
import { CreatePolicyCommand, ICommandHandler } from '@app/application';
import { RoleRepository } from '@app/infra/database/repositories/role.repository';

@Injectable()
export class CreatePolicyCommandHandler implements ICommandHandler<CreatePolicyCommand, Policy> {
  constructor(private readonly repository: PolicyRepository) {}

  async execute(command: CreatePolicyCommand): Promise<Policy> {
    const existing = await this.repository.findOne(
      (policy) => policy.name.toLowerCase() === command.name.toLowerCase(),
    );

    if (existing) {
      throw new ConflictException(`Policy ${command.name} already exists`);
    }

    const policy = Object.assign(new Policy(), {
      name: command.name,
      description: command.description,
    });

    return this.repository.create(policy);
  }
}
