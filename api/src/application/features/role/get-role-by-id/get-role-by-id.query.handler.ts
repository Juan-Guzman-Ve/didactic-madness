import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler } from '@app/application/contracts/base';
import { RoleRepository } from '@app/infra/database/repositories';
import { GetRoleByIdQuery } from './get-role-by-id.query';
import { RoleResponse, toRoleResponse } from '../role.response';

@Injectable()
export class GetRoleByIdQueryHandler implements IQueryHandler<GetRoleByIdQuery, RoleResponse> {
  constructor(private readonly repository: RoleRepository) {}

  async execute(query: GetRoleByIdQuery): Promise<RoleResponse> {
    const role = await this.repository.findById(query.id);

    if (!role) {
      throw new NotFoundException(`Role with ID ${query.id} not found`);
    }

    return toRoleResponse(role);
  }
}
