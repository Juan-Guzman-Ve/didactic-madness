import { IResponse, PaginationMeta } from '@app/application';

export class PolicyResponse implements IResponse {
  id!: number;
  name!: string;
  resource!: string;
  action!: string;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListPoliciesResponse implements IResponse {
  data!: PolicyResponse[];
  meta!: PaginationMeta;
}
