import { IResponse, PaginationMeta } from '@app/application';

export class CartResponse implements IResponse {
  id!: number;
  userId!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListCartsResponse implements IResponse {
  data!: CartResponse[];
  meta!: PaginationMeta;
}
