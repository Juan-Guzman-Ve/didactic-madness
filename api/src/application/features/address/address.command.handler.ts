import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IAddressRepository, ADDRESS_REPOSITORY, ICommandHandler } from '@app/application';
import { Address } from '@app/domain';
import { CreateAddressCommand, UpdateAddressCommand, DeleteAddressCommand } from './address.commands';
import { AddressResponse } from './address.responses';
import { AddressMapper } from './address.mapper';

@Injectable()
export class CreateAddressCommandHandler implements ICommandHandler<CreateAddressCommand, AddressResponse> {
  constructor(
    @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(command: CreateAddressCommand): Promise<AddressResponse> {
    const address = Object.assign(new Address(), {
      userId: command.userId,
      addressLine1: command.addressLine1,
      addressLine2: command.addressLine2,
      city: command.city,
      state: command.state,
      postalCode: command.postalCode,
      country: command.country,
      isDefault: command.isDefault ?? false,
    });
    const saved = await this.addressRepository.create(address);
    return AddressMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateAddressCommandHandler implements ICommandHandler<UpdateAddressCommand, AddressResponse> {
  constructor(
    @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(command: UpdateAddressCommand): Promise<AddressResponse> {
    const existing = await this.addressRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`Address with ID ${command.id} not found`);
    if (command.userId !== undefined && existing.userId !== command.userId) {
      throw new ForbiddenException('You do not own this address');
    }

    const updated = await this.addressRepository.updateById(command.id, {
      addressLine1: command.addressLine1,
      addressLine2: command.addressLine2,
      city: command.city,
      state: command.state,
      postalCode: command.postalCode,
      country: command.country,
      isDefault: command.isDefault,
    });
    return AddressMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteAddressCommandHandler implements ICommandHandler<DeleteAddressCommand, void> {
  constructor(
    @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(command: DeleteAddressCommand): Promise<void> {
    const existing = await this.addressRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`Address with ID ${command.id} not found`);
    if (command.userId !== undefined && existing.userId !== command.userId) {
      throw new ForbiddenException('You do not own this address');
    }
    await this.addressRepository.deleteById(command.id);
  }
}
