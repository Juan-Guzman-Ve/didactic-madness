import { Role } from '@app/domain';
import { RoleResponse } from './role.responses';

export class RoleMapper {
  static toResponse(role: Role): RoleResponse {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
