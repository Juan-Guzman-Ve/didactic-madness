import { Policy } from '@app/domain';
import { PolicyResponse } from './policy.responses';

export class PolicyMapper {
  static toResponse(policy: Policy): PolicyResponse {
    return {
      id: policy.id,
      name: policy.name,
      resource: policy.resource,
      action: policy.action,
      description: policy.description,
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt,
    };
  }
}
