import { Address } from '@app/domain';
import { AddressResponse } from './address.responses';

export class AddressMapper {
  static toResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      userId: address.userId,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}
