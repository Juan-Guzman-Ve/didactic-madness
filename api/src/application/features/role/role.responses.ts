import { IResponse } from '@app/application';
import { PaginationMeta } from '@app/application';

export class RoleResponse implements IResponse {
  id!: number;
  name!: string;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListRolesResponse implements IResponse {
  data!: RoleResponse[];
  meta!: PaginationMeta;
}
