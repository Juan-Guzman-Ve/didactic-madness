import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPolicyRepository, POLICY_REPOSITORY, IQueryHandler } from '@app/application';
import { GetPolicyByIdQuery, ListPoliciesQuery } from './policy.queries';
import { PolicyResponse, ListPoliciesResponse } from './policy.responses';
import { PolicyMapper } from './policy.mapper';

@Injectable()
export class GetPolicyByIdQueryHandler implements IQueryHandler<GetPolicyByIdQuery, PolicyResponse> {
  constructor(
    @Inject(POLICY_REPOSITORY) private readonly policyRepository: IPolicyRepository,
  ) {}

  async execute(query: GetPolicyByIdQuery): Promise<PolicyResponse> {
    const policy = await this.policyRepository.findById(query.id);
    if (!policy) throw new NotFoundException(`Policy with ID ${query.id} not found`);
    return PolicyMapper.toResponse(policy);
  }
}

@Injectable()
export class ListPoliciesQueryHandler implements IQueryHandler<ListPoliciesQuery, ListPoliciesResponse> {
  constructor(
    @Inject(POLICY_REPOSITORY) private readonly policyRepository: IPolicyRepository,
  ) {}

  async execute(query: ListPoliciesQuery): Promise<ListPoliciesResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.policyRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(PolicyMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
