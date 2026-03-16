import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRoleRepository, ROLE_REPOSITORY, IQueryHandler } from '@app/application';
import { GetRoleByIdQuery, ListRolesQuery } from './role.queries';
import { RoleResponse, ListRolesResponse } from './role.responses';
import { RoleMapper } from './role.mapper';

@Injectable()
export class GetRoleByIdQueryHandler implements IQueryHandler<GetRoleByIdQuery, RoleResponse> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRoleByIdQuery): Promise<RoleResponse> {
    const role = await this.roleRepository.findById(query.id);
    if (!role) throw new NotFoundException(`Role with ID ${query.id} not found`);
    return RoleMapper.toResponse(role);
  }
}

@Injectable()
export class ListRolesQueryHandler implements IQueryHandler<ListRolesQuery, ListRolesResponse> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: ListRolesQuery): Promise<ListRolesResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.roleRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(RoleMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
