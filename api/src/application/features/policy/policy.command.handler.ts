import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPolicyRepository, POLICY_REPOSITORY, ICommandHandler } from '@app/application';
import { Policy } from '@app/domain';
import { CreatePolicyCommand, UpdatePolicyCommand, DeletePolicyCommand } from './policy.commands';
import { PolicyResponse } from './policy.responses';
import { PolicyMapper } from './policy.mapper';

@Injectable()
export class CreatePolicyCommandHandler implements ICommandHandler<CreatePolicyCommand, PolicyResponse> {
  constructor(
    @Inject(POLICY_REPOSITORY) private readonly policyRepository: IPolicyRepository,
  ) {}

  async execute(command: CreatePolicyCommand): Promise<PolicyResponse> {
    const policy = Object.assign(new Policy(), {
      name: command.name,
      resource: command.resource,
      action: command.action,
      description: command.description,
    });
    const saved = await this.policyRepository.create(policy);
    return PolicyMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdatePolicyCommandHandler implements ICommandHandler<UpdatePolicyCommand, PolicyResponse> {
  constructor(
    @Inject(POLICY_REPOSITORY) private readonly policyRepository: IPolicyRepository,
  ) {}

  async execute(command: UpdatePolicyCommand): Promise<PolicyResponse> {
    const existing = await this.policyRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`Policy with ID ${command.id} not found`);

    const updated = await this.policyRepository.updateById(command.id, {
      name: command.name,
      resource: command.resource,
      action: command.action,
      description: command.description,
    });
    return PolicyMapper.toResponse(updated);
  }
}

@Injectable()
export class DeletePolicyCommandHandler implements ICommandHandler<DeletePolicyCommand, void> {
  constructor(
    @Inject(POLICY_REPOSITORY) private readonly policyRepository: IPolicyRepository,
  ) {}

  async execute(command: DeletePolicyCommand): Promise<void> {
    const exists = await this.policyRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`Policy with ID ${command.id} not found`);
    await this.policyRepository.deleteById(command.id);
  }
}
