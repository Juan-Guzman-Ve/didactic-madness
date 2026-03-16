import { IResponse, PaginationMeta } from '@app/application';

export class ProductResponse implements IResponse {
  id!: number;
  sku!: string;
  categoryId!: number;
  name!: string;
  description!: string;
  brand!: string;
  model?: string;
  price!: number;
  stock!: number;
  specifications?: Record<string, unknown>;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListProductsResponse implements IResponse {
  data!: ProductResponse[];
  meta!: PaginationMeta;
}
