import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IQuery } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';
import { AddressResponse, ListAddressesResponse } from './address.responses';

export class GetAddressByIdQuery implements IQuery<AddressResponse> {
  @ApiProperty()
  id!: number;
}

export class ListAddressesQuery implements IQuery<ListAddressesResponse> {
  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  sort?: string;

  userId?: number;
}
