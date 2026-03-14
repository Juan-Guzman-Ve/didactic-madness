import { IResponse } from '@app/application';
import { Role } from '@app/domain';

export class RoleResponse implements IResponse {
  id!: string;
  name!: string;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
}

export class ListRolesResponse implements IResponse {
  data!: RoleResponse[];
  meta!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const toRoleResponse = (role: Role): RoleResponse => {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    createdBy: role.createdBy,
    updatedBy: role.updatedBy,
  };
};
