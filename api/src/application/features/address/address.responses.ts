import { IResponse, PaginationMeta } from '@app/application';

export class AddressResponse implements IResponse {
  id!: number;
  userId!: number;
  addressLine1!: string;
  addressLine2?: string;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;
  isDefault!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListAddressesResponse implements IResponse {
  data!: AddressResponse[];
  meta!: PaginationMeta;
}
