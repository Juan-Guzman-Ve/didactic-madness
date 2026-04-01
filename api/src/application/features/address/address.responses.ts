
import { IResponse, PaginationMeta } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class AddressResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty({ example: '123 Main St' })
  addressLine1!: string;

  @ApiProperty({ example: 'Apt 4B', required: false })
  addressLine2?: string;

  @ApiProperty({ example: 'New York' })
  city!: string;

  @ApiProperty({ example: 'NY' })
  state!: string;

  @ApiProperty({ example: '10001' })
  postalCode!: string;

  @ApiProperty({ example: 'USA' })
  country!: string;

  @ApiProperty({ example: true })
  isDefault!: boolean;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-31T00:00:00.000Z' })
  updatedAt!: Date;
}

export class ListAddressesResponse implements IResponse {
  @ApiProperty({ type: [AddressResponse] })
  data!: AddressResponse[];

  @ApiProperty({ type: Object })
  meta!: PaginationMeta;
}
