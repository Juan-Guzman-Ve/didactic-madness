import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
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
@ApiExtraModels(ListAddressesQuery)
@Controller('addresses')
export class AddressController extends BaseController<
  CreateAddressCommand,
  UpdateAddressCommand,
  DeleteAddressCommand,
  GetAddressByIdQuery,
  AddressResponse
> {
  constructor(
    createHandler: CreateAddressCommandHandler,
    updateHandler: UpdateAddressCommandHandler,
    deleteHandler: DeleteAddressCommandHandler,
    getByIdHandler: GetAddressByIdQueryHandler,
    private readonly listHandler: ListAddressesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListAddressesQuery): Promise<ListAddressesResponse> {
      return this.listHandler.execute(query);
    }
}
