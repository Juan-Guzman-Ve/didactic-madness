import { IResponse, PaginationMeta } from '@app/application';

export class RolePolicyResponse implements IResponse {
  id!: number;
  roleId!: number;
  policyId!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListRolePoliciesResponse implements IResponse {
  data!: RolePolicyResponse[];
  meta!: PaginationMeta;
}
