import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CurrentUser } from '@app/presentation/decorators';
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

@ApiTags('storefront / addresses')
@ApiBearerAuth()
@ApiExtraModels(ListAddressesQuery)
@Controller('addresses')
export class StorefrontAddressesController extends BaseController<
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

  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<AddressResponse> {
    return super.getById(id);
  }

  @ApiBody({ type: CreateAddressCommand })
  @Post()
  override create(@Body() command: CreateAddressCommand): Promise<AddressResponse> {
    return super.create(command);
  }

  @ApiBody({ type: UpdateAddressCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAddressCommand,
  ): Promise<AddressResponse> {
    return super.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(
    @Query() query: ListAddressesQuery,
    @CurrentUser() user: { id: number },
  ): Promise<ListAddressesResponse> {
    query.userId = user.id;
    return this.listHandler.execute(query);
  }
}
