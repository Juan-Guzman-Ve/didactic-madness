import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleResponse, toRoleResponse,IQueryHandler,IRoleRepository,GetRoleByIdQuery} from '@app/application';

@Injectable()
export class GetRoleByIdQueryHandler implements IQueryHandler<GetRoleByIdQuery, RoleResponse> {
  constructor(private readonly repository: IRoleRepository) {}

  async execute(query: GetRoleByIdQuery): Promise<RoleResponse> {
    const role = await this.repository.findById(query.id);

    if (!role) {
      throw new NotFoundException(`Role with ID ${query.id} not found`);
    }

    return toRoleResponse(role);
  }
}
