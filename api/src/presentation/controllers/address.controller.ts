import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AddressResponse,
  CreateAddressCommand,
  CreateAddressCommandHandler,
  DeleteAddressCommand,
  DeleteAddressCommandHandler,
  GetAddressByIdQuery,
  GetAddressByIdQueryHandler,
  ListAddressesQuery,
  ListAddressesQueryHandler,
  ListAddressesResponse,
  UpdateAddressCommand,
  UpdateAddressCommandHandler,
} from '@app/application/features/address';
import { BaseController } from '@app/presentation/base';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController extends BaseController<
  CreateAddressCommand,
  UpdateAddressCommand,
  DeleteAddressCommand,
  GetAddressByIdQuery,
  ListAddressesQuery,
  AddressResponse,
  ListAddressesResponse
> {
  constructor(
    createHandler: CreateAddressCommandHandler,
    updateHandler: UpdateAddressCommandHandler,
    deleteHandler: DeleteAddressCommandHandler,
    getByIdHandler: GetAddressByIdQueryHandler,
    listHandler: ListAddressesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
