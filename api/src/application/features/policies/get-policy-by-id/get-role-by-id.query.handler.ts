import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleResponse, toRoleResponse,IQueryHandler,GetRoleByIdQuery} from '@app/application';
import { RoleRepository } from '@app/infra/database/repositories/role.repository';

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
