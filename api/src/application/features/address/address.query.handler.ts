import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAddressRepository, ADDRESS_REPOSITORY, IQueryHandler } from '@app/application';
import { GetAddressByIdQuery, ListAddressesQuery } from './address.queries';
import { AddressResponse, ListAddressesResponse } from './address.responses';
import { AddressMapper } from './address.mapper';

@Injectable()
export class GetAddressByIdQueryHandler implements IQueryHandler<GetAddressByIdQuery, AddressResponse> {
  constructor(
    @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(query: GetAddressByIdQuery): Promise<AddressResponse> {
    const address = await this.addressRepository.findById(query.id);
    if (!address) throw new NotFoundException(`Address with ID ${query.id} not found`);
    return AddressMapper.toResponse(address);
  }
}

@Injectable()
export class ListAddressesQueryHandler implements IQueryHandler<ListAddressesQuery, ListAddressesResponse> {
  constructor(
    @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(query: ListAddressesQuery): Promise<ListAddressesResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const params = { page, limit };
    const result = query.userId
      ? await this.addressRepository.findPaginatedByUserId(query.userId, params)
      : await this.addressRepository.findPaginated(params);

    return {
      data: result.data.map(AddressMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
