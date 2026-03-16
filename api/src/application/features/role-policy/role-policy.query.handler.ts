import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRolePolicyRepository, ROLE_POLICY_REPOSITORY, IQueryHandler } from '@app/application';
import { GetRolePolicyByIdQuery, ListRolePoliciesQuery } from './role-policy.queries';
import { RolePolicyResponse, ListRolePoliciesResponse } from './role-policy.responses';
import { RolePolicyMapper } from './role-policy.mapper';

@Injectable()
export class GetRolePolicyByIdQueryHandler implements IQueryHandler<GetRolePolicyByIdQuery, RolePolicyResponse> {
  constructor(
    @Inject(ROLE_POLICY_REPOSITORY) private readonly rolePolicyRepository: IRolePolicyRepository,
  ) {}

  async execute(query: GetRolePolicyByIdQuery): Promise<RolePolicyResponse> {
    const rolePolicy = await this.rolePolicyRepository.findById(query.id);
    if (!rolePolicy) throw new NotFoundException(`RolePolicy with ID ${query.id} not found`);
    return RolePolicyMapper.toResponse(rolePolicy);
  }
}

@Injectable()
export class ListRolePoliciesQueryHandler implements IQueryHandler<ListRolePoliciesQuery, ListRolePoliciesResponse> {
  constructor(
    @Inject(ROLE_POLICY_REPOSITORY) private readonly rolePolicyRepository: IRolePolicyRepository,
  ) {}

  async execute(query: ListRolePoliciesQuery): Promise<ListRolePoliciesResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.rolePolicyRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(RolePolicyMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
