import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY, IQueryHandler } from '@app/application';
import { GetUserByIdQuery, ListUsersQuery } from './user.queries';
import { UserResponse, ListUsersResponse } from './user.responses';
import { UserMapper } from './user.mapper';

@Injectable()
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery, UserResponse> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserResponse> {
    const user = await this.userRepository.findById(query.id);
    if (!user) throw new NotFoundException(`User with ID ${query.id} not found`);
    return UserMapper.toResponse(user);
  }
}

@Injectable()
export class ListUsersQueryHandler implements IQueryHandler<ListUsersQuery, ListUsersResponse> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: ListUsersQuery): Promise<ListUsersResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.userRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(UserMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
