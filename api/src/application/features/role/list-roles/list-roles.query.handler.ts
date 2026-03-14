import { Injectable } from '@nestjs/common';
import { IRoleRepository, ListRolesResponse, toRoleResponse, ListRolesQuery, IQueryHandler } from '@app/application';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Injectable()
export class ListRolesQueryHandler implements IQueryHandler<ListRolesQuery, ListRolesResponse> {
  constructor(private readonly repository: IRoleRepository) {}

  async execute(query: ListRolesQuery): Promise<ListRolesResponse> {
    const page = Math.max(query.page ?? DEFAULT_PAGE, 1);
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const { sortBy, sortOrder } = this.parseSort(query.sort);

    const result = await this.repository.findPaginated({
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return {
      data: result.data.map(toRoleResponse),
      meta: result.meta,
    };
  }

  private parseSort(sort?: string): { sortBy?: string; sortOrder?: 'ASC' | 'DESC' } {
    if (!sort) {
      return {};
    }

    const parts = sort.split(':');
    const sortBy = parts[0];
    const sortOrder = parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return { sortBy, sortOrder };
  }
}
