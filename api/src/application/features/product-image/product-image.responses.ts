import { IResponse, PaginationMeta } from '@app/application';

export class ProductImageResponse implements IResponse {
  id!: number;
  productId!: number;
  url!: string;
  displayOrder!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListProductImagesResponse implements IResponse {
  data!: ProductImageResponse[];
  meta!: PaginationMeta;
}
