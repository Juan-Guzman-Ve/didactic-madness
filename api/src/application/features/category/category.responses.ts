import { IResponse, PaginationMeta } from '@app/application';

export class CategoryResponse implements IResponse {
  id!: number;
  name!: string;
  description?: string;
  slug!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListCategoriesResponse implements IResponse {
  data!: CategoryResponse[];
  meta!: PaginationMeta;
}
