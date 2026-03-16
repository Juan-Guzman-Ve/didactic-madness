import { IResponse, PaginationMeta } from '@app/application';

export class UserResponse implements IResponse {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  roleId!: number;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListUsersResponse implements IResponse {
  data!: UserResponse[];
  meta!: PaginationMeta;
}
